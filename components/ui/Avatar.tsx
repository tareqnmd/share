'use client';

import Image from 'next/image';
import { useState } from 'react';

const DEFAULT_AVATAR = '/assets/images/user.webp';

interface AvatarProps {
	src?: string | null;
	alt: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const sizeMap = {
	sm: 24,
	md: 32,
	lg: 48,
};

const sizeClasses = {
	sm: 'w-6 h-6',
	md: 'w-8 h-8',
	lg: 'w-12 h-12',
};

export default function Avatar({
	src,
	alt,
	size = 'md',
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
				priority={size === 'lg'}
				unoptimized={imgSrc === DEFAULT_AVATAR}
			/>
		</div>
	);
}

