import SignIn from '@/components/shared/SignIn';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function Home() {
	const session = await getServerSession(authOptions);
	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
			<h1 className="text-5xl font-bold tracking-tight">
				Share Your Code Securely
			</h1>
			<p className="text-xl text-gray-600 max-w-2xl">
				A platform for developers to share snippets, collaborate in real-time,
				and manage their code files with granular permissions.
			</p>
			{session ? (
				<Link
					href="/public"
					className="border border-zinc-300 px-6 py-3 rounded-lg font-medium transition-colors"
				>
					Create a new file
				</Link>
			) : (
				<SignIn />
			)}
		</div>
	);
}
