//
// Copyright 2026 DXOS.org
//

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';
import wasm from 'vite-plugin-wasm';

import { composerPlugin } from '@dxos/app-framework/vite-plugin';

import { meta } from './src/meta';

const MODULE_FILE = 'plugin.mjs';

export default defineConfig({
  plugins: [
    wasm(),
    ...composerPlugin({ entry: 'src/plugin.tsx', meta, moduleFile: MODULE_FILE }),
    react(),
    // Inline every imported stylesheet into plugin.mjs. The community registry
    // serves a single bundle per plugin, so shipping a sibling .css file would
    // silently strip styles at runtime (Composer doesn't fetch siblings).
    cssInjectedByJs(),
  ],
  build: {
    // Required so top-level-await in transitively-bundled WASM modules (automerge, tiktoken)
    // compiles without an explicit polyfill.
    target: 'esnext',
    lib: {
      entry: 'src/plugin.tsx',
      formats: ['es'],
      fileName: () => MODULE_FILE,
    },
    // Inline every asset as a data URL. GitHub Releases sign each asset with a
    // per-file URL, so sibling-file imports from plugin.mjs can't resolve.
    assetsInlineLimit: () => true,
    rollupOptions: {
      output: {
        // Produce a single plugin.mjs for GitHub Release distribution.
        inlineDynamicImports: true,
      },
    },
  },
});
