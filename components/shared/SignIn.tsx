'use client';

import { signIn } from 'next-auth/react';
import { GoogleIcon } from '@/components/icons';

const SignIn = () => {
	return (
		<button
			onClick={() => signIn('google')}
			className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500/30"
		>
			<GoogleIcon className="w-4 h-4" />
			<span>Sign In with Google</span>
		</button>
	);
};

export default SignIn;
