'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

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
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
      <h2 className="text-2xl font-bold text-danger-400">Something went wrong!</h2>
      <p className="text-neutral-400 max-w-md">{error.message || "An unexpected error occurred."}</p>
      <Button variant="secondary" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
