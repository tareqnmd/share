'use client';
import { signOut } from 'next-auth/react';

const SignOut = () => {
	return (
		<button
			onClick={() => signOut()}
			className="text-sm text-danger-400 hover:text-danger-500 font-medium transition-colors"
		>
			Sign Out
		</button>
	);
};

export default SignOut;
