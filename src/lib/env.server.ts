import 'server-only';
import { z } from 'zod';

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_SECRET: z.string().min(1, 'APP_SECRET is required').optional(), // 纯前端项目可先留可选
});

export type ServerEnv = z.infer<typeof serverSchema>;

declare global {
   
  var __ENV_SERVER__: ServerEnv | undefined;
}

function loadServerEnv(): ServerEnv {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid server env:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid server environment variables.');
  }
  return parsed.data;
}

export const envServer: ServerEnv =
  globalThis.__ENV_SERVER__ ?? (globalThis.__ENV_SERVER__ = loadServerEnv());
