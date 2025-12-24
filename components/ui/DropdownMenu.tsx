'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownMenuItem {
	label: string;
	onClick: () => void;
	icon?: ReactNode;
	variant?: 'default' | 'danger';
	disabled?: boolean;
}

interface DropdownMenuProps {
	items: DropdownMenuItem[];
	trigger?: ReactNode;
}

export default function DropdownMenu({ items, trigger }: DropdownMenuProps) {
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
				{trigger || (
					<svg
						className="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<circle cx="12" cy="5" r="2" />
						<circle cx="12" cy="12" r="2" />
						<circle cx="12" cy="19" r="2" />
					</svg>
				)}
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
					{items.map((item, index) => (
						<button
							key={index}
							onClick={() => {
								if (!item.disabled) {
									item.onClick();
									setIsOpen(false);
								}
							}}
							disabled={item.disabled}
							className={`
								w-full px-4 py-2 text-left text-sm flex items-center gap-3
								transition-colors
								disabled:opacity-50 disabled:cursor-not-allowed
								${item.variant === 'danger'
									? 'text-danger-400 hover:bg-danger-500/10 hover:text-danger-300'
									: 'text-neutral-300 hover:bg-neutral-800 hover:text-neutral-50'
								}
							`}
						>
							{item.icon && <span className="w-4 h-4">{item.icon}</span>}
							{item.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

