'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-neutral-950 text-neutral-50">
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-6">
          <h2 className="text-4xl font-bold text-danger-400">Critical System Error</h2>
          <p className="max-w-md text-neutral-400">{error.message || "A critical error occurred."}</p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            Refresh Application
          </button>
        </div>
      </body>
    </html>
  );
}
