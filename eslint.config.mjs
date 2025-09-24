// eslint.config.mjs
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Next 官方推荐的规则（TS + core-web-vitals）
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  // 忽略项（来自官方示例）
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  // 你自定义的轻规则
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    },
  },
];
