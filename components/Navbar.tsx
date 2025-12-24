import Avatar from '@/components/ui/Avatar';
import Logo from '@/components/ui/Logo';
import { authOptions } from '@/lib/auth';
import { AppRoutes, UserRole } from '@/types/enums';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import SignIn from './shared/SignIn';
import SignOut from './shared/SignOut';

export default async function Navbar() {
	const session = await getServerSession(authOptions);

	return (
		<nav className="sticky top-0 z-50 border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl">
			<div className="app-container flex justify-between items-center h-16">
				<Logo size="md" />

				<div className="flex items-center gap-2">
					{session ? (
						<>
							<Link
								href={AppRoutes.DASHBOARD}
								className="px-3 py-2 text-sm font-medium hover:bg-neutral-800/50 rounded-lg transition-all"
							>
								Dashboard
							</Link>

							<div className="w-px h-6 bg-neutral-800 mx-1" />

							<div className="flex items-center gap-3 pl-2">
								<div className="flex flex-col items-end">
									<span className="text-sm font-medium text-neutral-200">
										{session.user?.name}
									</span>
									{session.user?.role === UserRole.ADMIN && (
										<span className="text-[10px] font-semibold uppercase tracking-wider text-primary-400">
											Admin
										</span>
									)}
								</div>

								<Avatar
									src={session.user?.image}
									alt={session.user?.name || 'User'}
									size="md"
								/>

								<SignOut />
							</div>
						</>
					) : (
						<SignIn />
					)}
				</div>
			</div>
		</nav>
	);
}
