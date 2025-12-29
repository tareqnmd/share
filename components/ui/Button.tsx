'use client';

import { SpinnerIcon } from '@/components/icons';
import { ButtonSize } from '@/enums/button-size.enum';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
	[ButtonVariant.PRIMARY]:
		'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-400',
	[ButtonVariant.SECONDARY]:
		'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400',
	[ButtonVariant.SUCCESS]:
		'bg-success-600 text-white hover:bg-success-700 focus-visible:ring-success-400',
	[ButtonVariant.DANGER]:
		'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-400',
	[ButtonVariant.GHOST]:
		'bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-neutral-50 focus-visible:ring-neutral-400',
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
		const isDisabled = disabled || isLoading;

		return (
			<button
				ref={ref}
				disabled={isDisabled}
				aria-disabled={isDisabled}
				aria-busy={isLoading}
				className={`
					inline-flex items-center justify-center gap-2
					font-medium
					rounded-lg
					transition-colors
					cursor-pointer
					focus:outline-none
					focus-visible:ring-2
					focus-visible:ring-offset-2
					focus-visible:ring-offset-neutral-950
					disabled:opacity-50
					disabled:cursor-not-allowed
					${variantStyles[variant]}
					${sizeStyles[size]}
					${className}
				`}
				{...props}
			>
				{isLoading && <SpinnerIcon className="h-4 w-4" aria-hidden="true" />}
				{children}
			</button>
		);
	}
);

Button.displayName = 'Button';

export default Button;
