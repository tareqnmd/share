import { ReactNode } from 'react';
import { DropdownMenuSection } from './dropdown.types';

export interface DropdownMenuProps {
	sections: DropdownMenuSection[];
	trigger?: ReactNode;
}
