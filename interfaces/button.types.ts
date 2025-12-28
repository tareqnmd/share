import { ReactNode } from 'react';
import { ButtonSize } from '../enums/button-size.enum';
import { ButtonVariant } from '../enums/button-variant.enum';

export interface ButtonProps {
	variant?: ButtonVariant;
	size?: ButtonSize;
	children: ReactNode;
	isLoading?: boolean;
}
