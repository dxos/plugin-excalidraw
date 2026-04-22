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

/**
 * The host Composer's import map only covers JS entrypoints — asset-style imports
 * (CSS, PCSS, etc.) from shared `@dxos/*` packages leak out as bare specifiers the
 * browser can't resolve (e.g. `@dxos/lit-ui/dx-tag-picker.pcss`).
 *
 * Those stylesheets are already loaded by the host bundle (Composer itself imports
 * `@dxos/react-ui-form` etc.), so every occurrence in a plugin is a redundant
 * side-effect import. Redirect each to a no-op virtual module so the bundle still
 * type-checks and executes but doesn't try to fetch a non-existent asset.
 */
const ASSET_EXTENSION = /\.(css|pcss|scss|sass|less|svg|png|jpe?g|gif|webp)$/;
const VIRTUAL_EMPTY_PREFIX = '\0excalidraw-empty:';
const dropSharedAssets = (): VitePlugin => ({
  name: 'excalidraw:drop-shared-assets',
  enforce: 'pre',
  resolveId(id) {
    if (ASSET_EXTENSION.test(id) && id.startsWith('@')) {
      return { id: VIRTUAL_EMPTY_PREFIX + id, external: false, moduleSideEffects: false };
    }
    return null;
  },
  load(id) {
    if (id.startsWith(VIRTUAL_EMPTY_PREFIX)) {
      return 'export {};';
    }
    return null;
  },
});

export default defineConfig({
  plugins: [dropSharedAssets(), wasm(), ...composerPlugin({ entry: 'src/plugin.tsx' }), react(), emitManifest()],
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
      // in a UI plugin bundle and break with `inlineDynamicImports + top-level await`.
      external: [/^tiktoken(\/|$)/, /^@anthropic-ai\/tokenizer(\/|$)/],
      output: {
        // Produce a single plugin.mjs for GitHub Release distribution.
        inlineDynamicImports: true,
      },
    },
  },
});
