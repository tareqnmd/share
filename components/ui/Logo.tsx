import { CodeIcon } from '@/components/icons';
import { AppRoutes } from '@/types/enums';
import Link from 'next/link';

interface LogoProps {
	size?: 'sm' | 'md' | 'lg';
	showText?: boolean;
	href?: string;
}

const sizeConfig = {
	sm: {
		container: 'w-6 h-6',
		icon: 'w-3 h-3',
		text: 'text-sm',
		gap: 'gap-1.5',
	},
	md: {
		container: 'w-8 h-8',
		icon: 'w-4 h-4',
		text: 'text-lg',
		gap: 'gap-2.5',
	},
	lg: {
		container: 'w-10 h-10',
		icon: 'w-5 h-5',
		text: 'text-xl',
		gap: 'gap-3',
	},
};

export default function Logo({ size = 'md', showText = true, href = AppRoutes.HOME }: LogoProps) {
	const config = sizeConfig[size];

	const content = (
		<>
			<div
				className={`${config.container} rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow`}
			>
				<CodeIcon className={`${config.icon} text-white`} />
			</div>
			{showText && (
				<span
					className={`${config.text} font-bold tracking-tight text-neutral-50 group-hover:text-primary-400 transition-colors`}
				>
					CodeShare
				</span>
			)}
		</>
	);

	if (href) {
		return (
			<Link href={href} className={`flex items-center ${config.gap} group`}>
				{content}
			</Link>
		);
	}

	return <div className={`flex items-center ${config.gap}`}>{content}</div>;
}

