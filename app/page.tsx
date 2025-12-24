import { PlusIcon } from '@/components/icons';
import SignIn from '@/components/shared/SignIn';
import { authOptions } from '@/lib/auth';
import { AppRoutes } from '@/types/enums';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function Home() {
	const session = await getServerSession(authOptions);
	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-6">
			<h1 className="text-5xl font-bold tracking-tight text-neutral-50">
				Share Your Code Securely
			</h1>
			<p className="text-xl text-neutral-300 max-w-[42rem] leading-relaxed">
				A platform for developers to share snippets, collaborate in real-time,
				and manage their code files with granular permissions.
			</p>
			{session ? (
				<Link
					href={AppRoutes.PUBLIC_FILES}
					className="flex items-center gap-2 border border-neutral-700 bg-neutral-900 px-6 py-4 rounded-lg font-medium transition-colors hover:bg-neutral-800 text-neutral-50"
				>
					<PlusIcon className="w-5 h-5" />
					Create a new file
				</Link>
			) : (
				<SignIn />
			)}
		</div>
	);
}
