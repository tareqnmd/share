import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import CodeFile from "@/models/CodeFile";
import { redirect } from "next/navigation";
import CreateFileButton from "@/components/dashboard/CreateFileButton";
import Link from "next/link";

async function getFiles(userId: string) {
    await connectDB();
    const files = await CodeFile.find({ createdBy: userId }).sort({ createdAt: -1 });
    return files;
}

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/');
    }
    
    const files = await getFiles(session.user.id);
    const fileCount = files.length;
    const isUser = session.user.role === 'user';
    const limit = 5;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Files</h1>
                <CreateFileButton disabled={isUser && fileCount >= limit} />
            </div>
            
            {isUser && (
                <div className="bg-zinc-100 p-4 rounded-lg border border-zinc-200">
                    <p className="font-medium">File Quota: {fileCount} / {limit} used</p>
                    <div className="w-full bg-zinc-300 h-2 rounded-full mt-2">
                        <div 
                            className="bg-blue-500 h-2 rounded-full transition-all" 
                            style={{ width: `${Math.min((fileCount / limit) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {files.map((file) => (
                    <Link href={`/code/${file._id}`} key={file._id.toString()} className="block p-6 border rounded-lg hover:shadow-md transition-shadow bg-white">
                        <div className="flex justify-between items-start mb-2">
                             <h3 className="font-bold text-lg truncate">{file.title}</h3>
                             <span className={`text-xs px-2 py-1 rounded-full ${file.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {file.visibility}
                             </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{file.language}</p>
                        <div className="text-xs text-gray-400">
                            Updated {new Date(file.updatedAt).toLocaleDateString()}
                        </div>
                    </Link>
                ))}
                {files.length === 0 && (
                    <p className="text-gray-500 col-span-full text-center py-10">You haven&apos;t created any files yet.</p>
                )}
            </div>
        </div>
    );
}
