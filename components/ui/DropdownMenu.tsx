'use client';

import { CheckIcon, DotsVerticalIcon } from '@/components/icons';
import { DropdownItemVariant } from '@/types/enums';
import { DropdownMenuItem, DropdownMenuSection } from '@/types/types';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface DropdownMenuProps {
	sections: DropdownMenuSection[];
	trigger?: ReactNode;
}

export default function DropdownMenu({ sections, trigger }: DropdownMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Escape') {
			setIsOpen(false);
		}
	};

	return (
		<div className="relative" ref={menuRef} onKeyDown={handleKeyDown}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="p-2 rounded-lg text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30"
				aria-label="Open menu"
				aria-expanded={isOpen}
			>
				{trigger || <DotsVerticalIcon className="w-5 h-5" />}
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-50 py-1 animate-in">
					{sections.map((section, sectionIndex) => (
						<div key={sectionIndex}>
							{sectionIndex > 0 && <div className="my-1 border-t border-neutral-700" />}

							{section.title && (
								<div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
									{section.title}
								</div>
							)}

							{section.items.map((item, itemIndex) => (
								<button
									key={itemIndex}
									onClick={() => {
										if (!item.disabled) {
											item.onClick();
											setIsOpen(false);
										}
									}}
									disabled={item.disabled}
									className={`
									w-full px-3 py-2 text-left text-sm flex items-center gap-3
									transition-colors
									disabled:opacity-50 disabled:cursor-not-allowed
									${
										item.variant === DropdownItemVariant.DANGER
											? 'text-danger-400 hover:bg-danger-500/10 hover:text-danger-300'
											: item.active
												? 'text-primary-400 bg-primary-500/10'
												: 'text-neutral-300 hover:bg-neutral-800 hover:text-neutral-50'
									}
								`}
								>
									{item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
									<span className="flex-1">{item.label}</span>
									{item.active && <CheckIcon className="w-4 h-4 text-primary-400" />}
								</button>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
