import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">Next.js + Tailwind v4 OK ✅</h1>
      <p className="mt-3 text-base/7">
        你现在看到的样式来自 <code className="rounded bg-slate-100 px-1.5 py-0.5">tailwindcss</code>。
      </p>
      <Link
        className="mt-6 inline-block rounded-lg px-4 py-2 text-sm font-medium ring-1 ring-slate-300 hover:bg-slate-50"
        href="/health"
      >
        打开 /health（SSR 调用 /api/health）
      </Link>
    </main>
  );
}
