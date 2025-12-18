import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
      <h1 className="text-5xl font-bold tracking-tight">Share Your Code Securely</h1>
      <p className="text-xl text-gray-600 max-w-2xl">
        A platform for developers to share snippets, collaborate in real-time, and manage their code files with granular permissions.
      </p>
      <div className="flex gap-4">
        <Link 
            href="/dashboard"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
        >
            Get Started
        </Link>
        <Link 
            href="/public" // We might want a public listing page? Requirement didn't strictly ask but implied "Any public collaborative file".
            className="border border-zinc-300 px-6 py-3 rounded-lg font-medium hover:bg-zinc-50 transition-colors"
        >
            Browse Public Files
        </Link>
      </div>
    </div>
  );
}
