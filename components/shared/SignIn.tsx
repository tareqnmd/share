'use client';
import { signIn } from 'next-auth/react';

const SignIn = () => {
	return (
		<button
			onClick={() => signIn('google')}
			className="bg-neutral-100 text-neutral-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-200 transition-colors"
		>
			Sign In with Google
		</button>
	);
};

export default SignIn;
