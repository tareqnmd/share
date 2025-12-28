import { AuthProvider } from '@/enums/auth-provider.enum';
import { UserRole } from '@/enums/user-role.enum';
import User from '@/models/User';
import { DefaultSession, NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from './db';
import { logger } from './logger';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			role: UserRole;
		} & DefaultSession['user'];
	}
}

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: '/',
		error: '/',
		signOut: '/',
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === AuthProvider.GOOGLE) {
				await connectDB();
				try {
					const existingUser = await User.findOne({ email: user.email });
					if (!existingUser) {
						await User.create({
							name: user.name || 'User',
							email: user.email!,
							image: user.image || '',
							providerId: account.providerAccountId,
							role: UserRole.USER,
						});
						logger.auth('login', undefined, { isNewUser: true, provider: 'google' });
					} else {
						logger.auth('login', existingUser._id.toString(), { provider: 'google' });
					}
					return true;
				} catch (error) {
					logger.error('Error saving user during sign in', error);
					logger.auth('login_failed', undefined, { error: 'Database error' });
					return false;
				}
			}
			return true;
		},
		async session({ session }) {
			if (session.user?.email) {
				await connectDB();
				const dbUser = await User.findOne({ email: session.user.email });
				if (dbUser) {
					session.user.id = dbUser._id.toString();
					session.user.role = dbUser.role as UserRole;
				}
			}
			return session;
		},
	},
	events: {
		async signOut({ token }) {
			if (token?.sub) {
				logger.auth('logout', token.sub as string);
			}
		},
	},
	session: {
		strategy: 'jwt',
	},
};
