//
// Copyright 2026 DXOS.org
//

// TODO: remove once a composerPlugin bump lands the equivalent shim (see
// @dxos/app-framework@fbff73c). @vitejs/plugin-react's JSX transform prepends a
// preamble check that requires `$RefreshReg$` / `$RefreshSig$` to be installed
// on the host's window — which doesn't happen for cross-origin plugins.
// Installing no-op stubs silences the check; fast refresh doesn't work across
// origins anyway so ordinary reloads are the iteration loop in dev.
if (typeof window !== 'undefined') {
  (window as any).$RefreshReg$ ??= () => {};
  (window as any).$RefreshSig$ ??= () => (type: any) => type;
  (window as any).__vite_plugin_react_preamble_installed__ = true;
}

import { ExcalidrawPlugin } from './ExcalidrawPlugin';

// The community registry loader expects a default export: either a Plugin or a
// zero-arg factory. `ExcalidrawPlugin` is already a factory via `Plugin.make`.
export default ExcalidrawPlugin;
