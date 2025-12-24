'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { SpinnerIcon } from '@/components/icons';
import { ButtonVariant, ButtonSize } from '@/types/enums';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	children: ReactNode;
	isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
	[ButtonVariant.PRIMARY]: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500/30',
	[ButtonVariant.SECONDARY]: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500/30',
	[ButtonVariant.SUCCESS]: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500/30',
	[ButtonVariant.DANGER]: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500/30',
	[ButtonVariant.GHOST]: 'bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-neutral-50 focus:ring-neutral-500/30',
};

const sizeStyles: Record<ButtonSize, string> = {
	[ButtonSize.SM]: 'px-3 py-1.5 text-xs',
	[ButtonSize.MD]: 'px-4 py-2 text-sm',
	[ButtonSize.LG]: 'px-6 py-3 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = ButtonVariant.PRIMARY,
			size = ButtonSize.MD,
			children,
			isLoading = false,
			disabled,
			className = '',
			...props
		},
		ref
	) => {
		return (
			<button
				ref={ref}
				disabled={disabled || isLoading}
				className={`
					inline-flex items-center justify-center gap-2
					font-medium
					rounded-lg
					transition-colors
					focus:outline-none
					focus:ring-2
					disabled:opacity-50
					disabled:cursor-not-allowed
					${variantStyles[variant]}
					${sizeStyles[size]}
					${className}
				`}
				{...props}
			>
				{isLoading && <SpinnerIcon className="h-4 w-4" />}
				{children}
			</button>
		);
	}
);

Button.displayName = 'Button';

export default Button;
