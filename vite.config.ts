//
// Copyright 2026 DXOS.org
//

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

import { composerPlugin } from '@dxos/app-framework/vite-plugin';

import { version } from './package.json' with { type: 'json' };
import { meta } from './src/meta';

export default defineConfig({
  // Resolve the `source` condition first so internal `#xxx` imports in this
  // package's own `imports` map route to `src/*.ts` during the dev/build run.
  // The conditional dist paths in `package.json#imports` are aspirational —
  // they only kick in if/when this plugin is built and republished as a
  // standalone library with `dist/lib/neutral/*.mjs` outputs. Vite's default
  // conditions (`module, browser, development|production, import`) are
  // restored alongside `source` because vite replaces the list rather than
  // appending, and deps like `@excalidraw/excalidraw` rely on `import`/`browser`
  // resolving their CSS/wasm subpath exports.
  resolve: {
    conditions: ['source', 'module', 'browser', 'development', 'production', 'import'],
  },
  plugins: [
    ...composerPlugin({ entry: 'src/ExcalidrawPlugin.tsx', meta: { ...meta, version } }),
    react(),
    wasm(),
  ],
});
