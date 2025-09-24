import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_API_BASE: z.string().url('NEXT_PUBLIC_API_BASE must be a valid URL').optional(),
});

export type ClientEnv = z.infer<typeof clientSchema>;

declare global {
   
  var __ENV_CLIENT__: ClientEnv | undefined;
}

function loadClientEnv(): ClientEnv {
  // 只挑选以 NEXT_PUBLIC_ 开头的变量，避免把其他变量带进来
  const source = {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  };
  const parsed = clientSchema.safeParse(source);
  if (!parsed.success) {
    console.error('❌ Invalid client env:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid client environment variables.');
  }
  return parsed.data;
}

export const envClient: ClientEnv =
  globalThis.__ENV_CLIENT__ ?? (globalThis.__ENV_CLIENT__ = loadClientEnv());
