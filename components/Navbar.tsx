import { authOptions } from '@/lib/auth';
import { AppRoutes, UserRole } from '@/types/enums';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import SignIn from './shared/SignIn';
import SignOut from './shared/SignOut';

export default async function Navbar() {
	const session = await getServerSession(authOptions);

	return (
		<nav className="border-b border-neutral-800 bg-neutral-900 py-4">
			<div className="app-container flex justify-between items-center">
				<Link
					href={AppRoutes.HOME}
					className="text-xl font-bold tracking-tight text-neutral-50"
				>
					Share
				</Link>
				<div className="flex gap-4 items-center">
					{session ? (
						<>
							<Link
								href={AppRoutes.DASHBOARD}
								className="text-sm font-medium text-neutral-300 hover:text-primary-400 transition-colors"
							>
								Dashboard
							</Link>
							<div className="flex flex-col text-right text-sm">
								<span className="font-medium text-neutral-50">{session.user?.name}</span>
								{session.user?.role === UserRole.ADMIN && (
									<span className="badge badge-primary text-xs">
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
			</div>
		</nav>
	);
}
