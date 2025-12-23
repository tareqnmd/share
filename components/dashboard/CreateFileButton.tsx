'use client';

import { createCodeFile } from "@/app/actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppRoutes, FileVisibility, FileEditMode } from "@/types/enums";

export default function CreateFileButton({ disabled }: { disabled: boolean }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleCreate = () => {
        startTransition(async () => {
            try {
                // Default new file
                const id = await createCodeFile({
                    title: "Untitled",
                    language: "javascript",
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
        <button 
            onClick={handleCreate} 
            disabled={disabled || isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? "Creating..." : "Create New File"}
        </button>
    );
}
