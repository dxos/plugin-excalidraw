//
// Copyright 2026 DXOS.org
//

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

import { composerPlugin } from '@dxos/app-framework/vite-plugin';

import { meta } from './src/meta';

const MODULE_FILE = 'plugin.mjs';

export default defineConfig({
  plugins: [wasm(), ...composerPlugin({ entry: 'src/plugin.tsx', meta, moduleFile: MODULE_FILE }), react()],
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
    // Convert mixed-ESM-and-CJS bundled deps (e.g. transitive `react-virtualized`,
    // some react ecosystem packages) so their `require('react')` calls become ES
    // imports — otherwise the browser bundle ships a bare `require(...)` that the
    // runtime doesn't expose.
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // Produce a single plugin.mjs for GitHub Release distribution.
        inlineDynamicImports: true,
      },
    },
  },
});
