import { NextResponse } from 'next/server';
import { envServer } from '@/lib/env.server';

export function GET() {
  return NextResponse.json({
    ok: true,
    ts: new Date().toISOString(),
    env: envServer.NODE_ENV,
    hasSecret: Boolean(envServer.APP_SECRET),
  });
}
