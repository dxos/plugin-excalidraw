//
// Copyright 2026 DXOS.org
//

import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin as VitePlugin } from 'vite';
import wasm from 'vite-plugin-wasm';

import { composerPlugin } from '@dxos/app-framework/vite-plugin';

import { meta } from './src/meta';

const MODULE_FILE = 'plugin.mjs';

/**
 * Emit `manifest.json` alongside the built plugin module so the DXOS community
 * registry can resolve this repo's latest GitHub Release.
 *
 * TODO: once `@dxos/app-framework@main` republishes with the merged fold of
 * `emit-manifest` into `composerPlugin`, drop this and pass `meta` to
 * `composerPlugin` instead.
 */
const emitManifest = (): VitePlugin => ({
  name: 'excalidraw:emit-manifest',
  apply: 'build',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'manifest.json',
      source: JSON.stringify({ ...meta, moduleFile: MODULE_FILE }, null, 2),
    });
  },
});

export default defineConfig({
  plugins: [wasm(), ...composerPlugin({ entry: 'src/plugin.tsx' }), react(), emitManifest()],
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
      // Transitive WASM deps (tiktoken via @anthropic-ai/tokenizer, etc.) have no business
      // in a UI plugin bundle and break with `inlineDynamicImports + top-level await`. Mark
      // them external so rolldown doesn't try to bundle them at all.
      external: [/^tiktoken(\/|$)/, /^@anthropic-ai\/tokenizer(\/|$)/],
      output: {
        // Produce a single plugin.mjs for GitHub Release distribution.
        inlineDynamicImports: true,
      },
    },
  },
});
