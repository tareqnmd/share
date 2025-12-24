'use client';

import { signOut } from 'next-auth/react';

const SignOut = () => {
	return (
		<button
			onClick={() => signOut()}
			className="px-3 py-1.5 text-sm font-medium text-danger-400 border border-danger-500/30 rounded-lg hover:bg-danger-500/10 hover:text-danger-300 hover:border-danger-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-danger-500/30"
		>
			Sign Out
		</button>
	);
};

export default SignOut;
