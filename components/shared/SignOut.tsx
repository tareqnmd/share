'use client';

import Button from '@/components/ui/Button';
import { signOut } from 'next-auth/react';

const SignOut = () => {
	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => signOut()}
			className="text-danger-400 hover:text-danger-500 hover:bg-danger-500/10"
		>
			Sign Out
		</Button>
	);
};

export default SignOut;
