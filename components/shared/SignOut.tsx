'use client';

import { LogoutIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import { ButtonSize } from '@/enums/button-size.enum';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { signOut } from 'next-auth/react';

const SignOut = () => {
	return (
		<Button variant={ButtonVariant.OUTLINE_DANGER} size={ButtonSize.SM} onClick={() => signOut()}>
			<LogoutIcon className="w-4 h-4" />
			<span className="max-sm:hidden">Sign Out</span>
		</Button>
	);
};

export default SignOut;
