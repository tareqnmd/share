'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { SpinnerIcon } from '@/components/icons';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	children: ReactNode;
	isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500/30',
	secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500/30',
	success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500/30',
	danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500/30',
	ghost: 'bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-neutral-50 focus:ring-neutral-500/30',
};

const sizeStyles: Record<ButtonSize, string> = {
	sm: 'px-3 py-1.5 text-xs',
	md: 'px-4 py-2 text-sm',
	lg: 'px-6 py-3 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'primary',
			size = 'md',
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
