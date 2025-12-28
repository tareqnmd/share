import { ReactNode } from 'react';
import { DropdownItemVariant } from '../enums/dropdown-item-variant.enum';

export interface DropdownMenuItem {
	label: string;
	onClick: () => void;
	icon?: ReactNode;
	variant?: DropdownItemVariant;
	disabled?: boolean;
	active?: boolean;
}

export interface DropdownMenuSection {
	title?: string;
	items: DropdownMenuItem[];
}
