'use client';

import { createCodeFile } from '@/app/actions';
import { PlusIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import { AppRoutes } from '@/enums/app-routes.enum';
import { ButtonSize } from '@/enums/button-size.enum';
import { ButtonVariant } from '@/enums/button-variant.enum';
import { FileEditMode } from '@/enums/file-edit-mode.enum';
import { FileVisibility } from '@/enums/file-visibility.enum';
import { LANGUAGE_OPTIONS } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function CreateFileButton({ disabled }: { disabled: boolean }) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleCreate = () => {
		startTransition(async () => {
			try {
				const id = await createCodeFile({
					title: 'Untitled',
					language: LANGUAGE_OPTIONS[0].value,
					content: '// Start coding...',
					visibility: FileVisibility.PUBLIC,
					editMode: FileEditMode.OWNER,
				});
				router.push(`${AppRoutes.CODE}/${id}`);
			} catch (error) {
				toast.error('Failed to create file', {
					description: (error as Error).message,
				});
			}
		});
	};

	return (
		<Button
			variant={ButtonVariant.PRIMARY}
			size={ButtonSize.MD}
			onClick={handleCreate}
			disabled={disabled}
			isLoading={isPending}
		>
			{!isPending && <PlusIcon className="w-5 h-5" />}
			Create New File
		</Button>
	);
}
