'use client';

import { signIn } from 'next-auth/react';
import Button from '@/components/ui/Button';

const SignIn = () => {
	return (
		<Button
			variant="secondary"
			size="md"
			onClick={() => signIn('google')}
		>
			Sign In with Google
		</Button>
	);
};

export default SignIn;
