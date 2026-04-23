import { defineConfig } from 'tsup'
export default defineConfig({
  entry: { cli: 'src/index.ts' },
  format: ['esm'],
  target: 'node18',
  sourcemap: false,
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
  noExternal: ['chalk', 'open'],
  outExtension({ entry }) {
    return { js: '.js' }
  },
})
