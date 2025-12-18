import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import CodeFile from "@/models/CodeFile";
import { notFound, redirect } from "next/navigation";
import FileEditor from "@/components/editor/FileEditor";
import { canEditFile } from "@/lib/permissions";

export default async function CodePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    await connectDB();
    let file;
    try {
        file = await CodeFile.findById(id).populate('createdBy', 'name email _id');
    } catch {
        notFound();
    }
    
    if (!file) notFound();

    const session = await getServerSession(authOptions);
    
    // Check Read Permission
    if (file.visibility === 'private') {
        if (!session || !session.user) redirect('/');
        if (file.createdBy._id.toString() !== session.user.id) {
             redirect('/');
        }
    }

    // Check Edit Permission
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
}
