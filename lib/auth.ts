import User from '@/models/User';
import { UserRole } from '@/types/enums';
import { DefaultSession, NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from './db';

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
			if (account?.provider === 'google') {
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
					}
					return true;
				} catch (error) {
					console.error('Error saving user', error);
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
	session: {
		strategy: 'jwt',
	},
};
