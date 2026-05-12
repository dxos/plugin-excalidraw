//
// Copyright 2023 DXOS.org
//

// TODO(wittjosiah): Switch to `Plugin.lazy(meta, () => import('#plugin'))` once
// the pinned `@dxos/app-framework` snapshot exports it (added in dxos/dxos#11150).
// For now, re-export the eager plugin so the `./plugin` subpath is still a
// valid library entry — consumers get the same `import { ExcalidrawPlugin }`
// shape as every other plugin's `/plugin` subpath, just without the lazy
// indirection.
export { default as ExcalidrawPlugin } from './ExcalidrawPlugin';
export { ExcalidrawOperationHandlerSet } from './operations';
