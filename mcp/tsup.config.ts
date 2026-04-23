import { defineConfig } from 'tsup'
export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  target: 'node18',
  sourcemap: false,
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
  noExternal: ['@modelcontextprotocol/sdk', 'zod'],
})
