'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AvatarSize } from '@/types/enums';

const DEFAULT_AVATAR = '/assets/images/user.webp';

interface AvatarProps {
	src?: string | null;
	alt: string;
	size?: AvatarSize;
	className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
	[AvatarSize.SM]: 24,
	[AvatarSize.MD]: 32,
	[AvatarSize.LG]: 48,
};

const sizeClasses: Record<AvatarSize, string> = {
	[AvatarSize.SM]: 'w-6 h-6',
	[AvatarSize.MD]: 'w-8 h-8',
	[AvatarSize.LG]: 'w-12 h-12',
};

export default function Avatar({
	src,
	alt,
	size = AvatarSize.MD,
	className = '',
}: AvatarProps) {
	const [imgSrc, setImgSrc] = useState(src || DEFAULT_AVATAR);
	const [hasError, setHasError] = useState(false);

	const handleError = () => {
		if (!hasError) {
			setHasError(true);
			setImgSrc(DEFAULT_AVATAR);
		}
	};

	const dimension = sizeMap[size];

	return (
		<div
			className={`relative overflow-hidden rounded-full ring-2 ring-neutral-700 ${sizeClasses[size]} ${className}`}
		>
			<Image
				src={imgSrc}
				alt={alt}
				width={dimension}
				height={dimension}
				className="object-cover w-full h-full"
				onError={handleError}
				priority={size === AvatarSize.LG}
				unoptimized={imgSrc === DEFAULT_AVATAR}
			/>
		</div>
	);
}

