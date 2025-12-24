'use client';

import { createCodeFile } from "@/app/actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppRoutes, FileVisibility, FileEditMode } from "@/types/enums";
import { LANGUAGE_OPTIONS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import { PlusIcon } from "@/components/icons";

export default function CreateFileButton({ disabled }: { disabled: boolean }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleCreate = () => {
        startTransition(async () => {
            try {
                const id = await createCodeFile({
                    title: "Untitled",
                    language: LANGUAGE_OPTIONS[0].value,
                    content: "// Start coding...",
                    visibility: FileVisibility.PUBLIC,
                    editMode: FileEditMode.OWNER
                });
                router.push(`${AppRoutes.CODE}/${id}`);
            } catch (error) {
                alert("Failed to create file: " + (error as Error).message);
            }
        });
    };

    return (
        <Button 
            variant="primary"
            size="md"
            onClick={handleCreate} 
            disabled={disabled}
            isLoading={isPending}
        >
            <PlusIcon className="w-5 h-5" />
            Create New File
        </Button>
    );
}
