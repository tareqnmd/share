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
				{/* Logo */}
				<Link
					href={AppRoutes.HOME}
					className="flex items-center gap-2.5 group"
				>
					<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
						<svg
							className="w-4.5 h-4.5 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
							/>
						</svg>
					</div>
					<span className="text-lg font-bold tracking-tight text-neutral-50 group-hover:text-primary-400 transition-colors">
						CodeShare
					</span>
				</Link>

				{/* Navigation */}
				<div className="flex items-center gap-2">
					{session ? (
						<>
							<Link
								href={AppRoutes.DASHBOARD}
								className="px-3 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800/50 rounded-lg transition-all"
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

								<img
									src={
										session.user?.image ||
										`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
											session.user?.name || 'User'
										)}&backgroundColor=334155&textColor=f8fafc`
									}
									alt={session.user?.name || 'User'}
									className="w-8 h-8 rounded-full ring-2 ring-neutral-700"
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
