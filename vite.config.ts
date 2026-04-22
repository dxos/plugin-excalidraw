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
    // runtime doesn't expose. `esmExternals` is the same fix applied to the CJS-only
    // React-helpers (e.g. `use-sync-external-store`) that also call `require('react')`.
    commonjsOptions: {
      transformMixedEsModules: true,
      esmExternals: true,
      requireReturnsDefault: 'namespace',
    },
    rollupOptions: {
      output: {
        // Produce a single plugin.mjs for GitHub Release distribution.
        inlineDynamicImports: true,
        // Shim `require` at the top of the bundle so CJS-only transitives (e.g.
        // `use-sync-external-store` via `@preact/signals-react`) can call
        // `require('react')` at runtime. Rolldown's external-CJS handling emits
        // `typeof require < 'u' ? require(...) : throw` — this banner provides
        // the `require` so we hit the happy path and forward to the externalized
        // host-provided module.
        banner: [
          "import * as __ReactForCjsShim from 'react';",
          "import * as __ReactDomForCjsShim from 'react-dom';",
          "import * as __ReactJsxRuntimeForCjsShim from 'react/jsx-runtime';",
          "const __cjsExternalShim = new Map([",
          "  ['react', __ReactForCjsShim.default ?? __ReactForCjsShim],",
          "  ['react-dom', __ReactDomForCjsShim.default ?? __ReactDomForCjsShim],",
          "  ['react/jsx-runtime', __ReactJsxRuntimeForCjsShim],",
          "]);",
          "globalThis.require = globalThis.require ?? ((id) => {",
          "  if (__cjsExternalShim.has(id)) return __cjsExternalShim.get(id);",
          "  throw new Error('Unsupported CJS require at runtime: ' + id);",
          "});",
        ].join('\n'),
      },
    },
  },
});
