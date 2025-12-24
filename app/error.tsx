'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
      <h2 className="text-2xl font-bold text-danger-400">Something went wrong!</h2>
      <p className="text-neutral-400 max-w-md">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-md font-medium hover:bg-neutral-200 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
