import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import CodeFile from "@/models/CodeFile";
import { redirect } from "next/navigation";
import CreateFileButton from "@/components/dashboard/CreateFileButton";
import Link from "next/link";
import { UserRole, AppRoutes, FileVisibility } from "@/types/enums";

async function getFiles(userId: string) {
    await connectDB();
    const files = await CodeFile.find({ createdBy: userId }).sort({ createdAt: -1 });
    return files;
}

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect(AppRoutes.HOME);
    }
    
    const files = await getFiles(session.user.id);
    const fileCount = files.length;
    const isUser = session.user.role === UserRole.USER;
    const limit = 5;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-neutral-50">My Files</h1>
                <CreateFileButton disabled={isUser && fileCount >= limit} />
            </div>
            
            {isUser && (
                <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                    <p className="font-medium text-neutral-50">File Quota: {fileCount} / {limit} used</p>
                    <div className="w-full bg-neutral-700 h-2 rounded-full mt-2">
                        <div 
                            className="bg-primary-600 h-2 rounded-full transition-all" 
                            style={{ width: `${Math.min((fileCount / limit) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {files.map((file) => (
                    <Link 
                        href={`${AppRoutes.CODE}/${file._id}`} 
                        key={file._id.toString()} 
                        className="card block transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg truncate text-neutral-50">{file.title}</h3>
                            <span className={`badge ${file.visibility === FileVisibility.PUBLIC ? 'badge-success' : 'badge-neutral'}`}>
                                {file.visibility}
                            </span>
                        </div>
                        <p className="text-sm text-neutral-400 mb-4">{file.language}</p>
                        <div className="text-xs text-neutral-500">
                            Updated {new Date(file.updatedAt).toLocaleDateString()}
                        </div>
                    </Link>
                ))}
                {files.length === 0 && (
                    <p className="text-neutral-400 col-span-full text-center py-10">
                        You haven&apos;t created any files yet.
                    </p>
                )}
            </div>
        </div>
    );
}
