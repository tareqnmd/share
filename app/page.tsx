import CreateFileButton from '@/components/dashboard/CreateFileButton';
import SignIn from '@/components/shared/SignIn';
import { authOptions } from '@/lib/auth';
import { homeMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = homeMetadata;

export default async function Home() {
	const session = await getServerSession(authOptions);
	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] text-center gap-6">
			<h1 className="text-5xl font-bold tracking-tight text-neutral-50">
				Share Your Code Securely
			</h1>
			<p className="text-xl text-neutral-300 max-w-2xl leading-relaxed">
				A platform for developers to share snippets, collaborate in real-time, and manage their code
				files with granular permissions.
			</p>
			{session ? <CreateFileButton disabled={false} /> : <SignIn />}
		</div>
	);
}
