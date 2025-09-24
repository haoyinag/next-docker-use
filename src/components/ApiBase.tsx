'use client';
import { envClient } from '@/lib/env.client';

export function ApiBase() {
  return (
    <p className="text-sm mt-2">
      API Base:{' '}
      <code className="rounded bg-slate-100 px-1.5 py-0.5">
        {envClient.NEXT_PUBLIC_API_BASE ?? '(not set)'}
      </code>
    </p>
  );
}
