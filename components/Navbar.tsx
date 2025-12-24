import Avatar from '@/components/ui/Avatar';
import Logo from '@/components/ui/Logo';
import { authOptions } from '@/lib/auth';
import { AppRoutes, AvatarSize, UserRole } from '@/types/enums';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import SignIn from './shared/SignIn';
import SignOut from './shared/SignOut';

export default async function Navbar() {
	const session = await getServerSession(authOptions);

	return (
		<nav className="sticky top-0 z-50 border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-xl">
			<div className="app-container flex-wrap flex justify-between items-center py-4 gap-2">
				<Logo />
				<div className="flex items-center gap-2 sm:gap-4">
					{session ? (
						<>
							<Link
								href={AppRoutes.DASHBOARD}
								className="text-sm font-medium transition-all"
							>
								Dashboard
							</Link>

							<div className="w-px h-6 bg-neutral-800" />

							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<div className="max-sm:hidden flex flex-col items-end">
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
									size={AvatarSize.MD}
								/>
								</div>

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
