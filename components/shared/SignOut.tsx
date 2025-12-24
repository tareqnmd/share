'use client';

import { signOut } from 'next-auth/react';
import { LogoutIcon } from '@/components/icons';

const SignOut = () => {
	return (
		<button
			onClick={() => signOut()}
			className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-danger-400 border border-danger-500/30 rounded-lg hover:bg-danger-500/10 hover:text-danger-300 hover:border-danger-500/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-danger-500/30"
		>
			<LogoutIcon className="w-4 h-4" />
			<span className="max-sm:hidden">Sign Out</span>
		</button>
	);
};

export default SignOut;
