import { headers } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getHealth() {
  const h = await headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/health`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json() as Promise<{ ok: boolean; ts: string; env?: string }>;
}

export default async function HealthPage() {
  const data = await getHealth();
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">/health</h1>
      <pre className="mt-4 rounded-lg bg-slate-100 p-4 text-sm">{JSON.stringify(data, null, 2)}</pre>
      <Link className="mt-6 inline-block text-sm underline" href="/">← 返回首页</Link>
    </main>
  );
}
