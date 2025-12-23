'use client';
import { AppRoutes, UserRole } from '@/types/enums';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
	const { data: session } = useSession();

	return (
		<nav className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex justify-between items-center bg-white dark:bg-zinc-950">
			<Link
				href={AppRoutes.HOME}
				className="text-xl font-bold tracking-tight"
			>
				Share
			</Link>
			<div className="flex gap-4 items-center">
				{session ? (
					<>
						<Link
							href={AppRoutes.DASHBOARD}
							className="text-sm font-medium hover:text-blue-500"
						>
							Dashboard
						</Link>
						<div className="flex flex-col text-right text-sm">
							<span className="font-medium">{session.user?.name}</span>
							{session.user?.role === UserRole.ADMIN && (
								<span className="text-xs text-blue-600 font-bold bg-blue-100 px-1 rounded inline-block text-center">
									Admin
								</span>
							)}
						</div>
						<button
							onClick={() => signOut()}
							className="text-sm text-red-500 hover:text-red-600 font-medium"
						>
							Sign Out
						</button>
					</>
				) : (
					<button
						onClick={() => signIn('google')}
						className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-800 transition-colors"
					>
						Sign In with Google
					</button>
				)}
			</div>
		</nav>
	);
}
