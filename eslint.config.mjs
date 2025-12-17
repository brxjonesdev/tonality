import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
    extends: ['eslint:recommended'],
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',
      // Additional Next.js rules
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  // Prettier configuration
  {
    files: ['**/*.{js,jsx,ts,tsx,json,css,md}'],
    rules: {
      'prettier/prettier': 'error',
    },
  },
];

export default eslintConfig;
