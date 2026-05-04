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
  plugins: [
    ...composerPlugin({ entry: 'src/plugin.tsx', meta: { ...meta, version } }),
    react(),
    wasm(),
  ],
});
