'use client';

import { forwardRef, SelectHTMLAttributes, useId } from 'react';
import { ChevronDownIcon } from '@/components/icons';
import { SelectOption } from '@/types/types';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
	options: readonly SelectOption[];
	label?: string;
	error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ options, label, error, className = '', id, ...props }, ref) => {
		const generatedId = useId();
		const selectId = id || generatedId;

		return (
			<div className="flex flex-col gap-1">
				{label && (
					<label
						htmlFor={selectId}
						className="text-sm font-medium text-neutral-300"
					>
						{label}
					</label>
				)}
				<div className="relative">
					<select
						ref={ref}
						id={selectId}
						className={`
							appearance-none
							w-full
							bg-neutral-900
							text-neutral-50
							text-sm
							border border-neutral-700
							rounded-lg
							px-3 py-2
							pr-8
							cursor-pointer
							transition-colors
							hover:border-neutral-600
							focus:border-primary-500
							focus:outline-none
							focus:ring-2
							focus:ring-primary-500/30
							disabled:opacity-50
							disabled:cursor-not-allowed
							${error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/30' : ''}
							${className}
						`}
						{...props}
					>
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
						<ChevronDownIcon className="h-4 w-4 text-neutral-400" />
					</div>
				</div>
				{error && (
					<span className="text-xs text-danger-400">{error}</span>
				)}
			</div>
		);
	}
);

Select.displayName = 'Select';

export default Select;
