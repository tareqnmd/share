import { authOptions } from '@/lib/auth';
import { AppRoutes, UserRole } from '@/types/enums';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import SignIn from './shared/SignIn';
import SignOut from './shared/SignOut';

export default async function Navbar() {
	const session = await getServerSession(authOptions);

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
						<SignOut />
					</>
				) : (
					<SignIn />
				)}
			</div>
		</nav>
	);
}
