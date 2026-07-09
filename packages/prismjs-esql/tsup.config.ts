import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  outDir: 'lib',
  clean: true,
  sourcemap: true,
  dts: false,
  splitting: false,
  target: 'es2022',
  // ESM as .mjs so Node treats it as ESM without "type": "module" in root
  outExtension({ format }) {
    return format === 'esm' ? { js: '.mjs' } : {};
  },
});
