import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js Starter',
  description: 'Next 15 + React 19 + Tailwind v4',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-dvh bg-white antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}
