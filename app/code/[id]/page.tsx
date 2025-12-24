import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import CodeFile from "@/models/CodeFile";
import { notFound, redirect } from "next/navigation";
import FileEditor from "@/components/editor/FileEditor";
import { canEditFile } from "@/lib/permissions";
import { AppRoutes, FileVisibility } from "@/types/enums";

export default async function CodePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    try {
        await connectDB();
        let file;
        try {
            file = await CodeFile.findById(id).populate('createdBy', 'name email _id');
        } catch {
            notFound();
        }
        
        if (!file) notFound();

        const session = await getServerSession(authOptions);
        
        if (file.visibility === FileVisibility.PRIVATE) {
            if (!session || !session.user) redirect(AppRoutes.HOME);
            if (file.createdBy._id.toString() !== session.user.id) {
                 redirect(AppRoutes.HOME);
            }
        }

        let canEdit = false;
        if (session && session.user) {
            canEdit = await canEditFile(session.user.id, id);
        }

        return (
            <FileEditor 
                file={JSON.parse(JSON.stringify(file))}
                canEdit={canEdit}
                currentUserId={session?.user?.id}
            />
        );
    } catch (error) {
        const err = error as Error & { digest?: string };
        if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_NOT_FOUND')) {
            throw error;
        }
        throw new Error("Failed to load code file");
    }
}
