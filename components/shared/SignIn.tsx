'use client';
import { signIn } from 'next-auth/react';

const SignIn = () => {
	return (
		<button
			onClick={() => signIn('google')}
			className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-zinc-800 transition-colors"
		>
			Sign In with Google
		</button>
	);
};

export default SignIn;
