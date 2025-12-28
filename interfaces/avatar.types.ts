import { AvatarSize } from '../enums/avatar-size.enum';

export interface AvatarProps {
	src?: string | null;
	alt: string;
	size?: AvatarSize;
	className?: string;
}
