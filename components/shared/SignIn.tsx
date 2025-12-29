'use client';

import { GoogleIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import { AuthProvider } from '@/enums/auth-provider.enum';
import { ButtonSize } from '@/enums/button-size.enum';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { signIn } from 'next-auth/react';

const SignIn = () => {
	return (
		<Button
			variant={ButtonVariant.OUTLINE_ACCENT}
			size={ButtonSize.SM}
			onClick={() => signIn(AuthProvider.GOOGLE)}
			className="px-6! py-2.5!"
		>
			<GoogleIcon className="w-4 h-4" />
			<span className="max-sm:hidden">Sign In</span>
		</Button>
	);
};

export default SignIn;
