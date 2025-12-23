import { signOut } from 'next-auth/react';

const SignOut = () => {
	return (
		<button
			onClick={() => signOut()}
			className="text-sm text-red-500 hover:text-red-600 font-medium"
		>
			Sign Out
		</button>
	);
};

export default SignOut;
