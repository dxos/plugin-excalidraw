//
// Copyright 2026 DXOS.org
//

import { ExcalidrawPlugin } from './ExcalidrawPlugin';

// The community registry loader expects a default export: either a Plugin or a
// zero-arg factory. `ExcalidrawPlugin` is already a factory via `Plugin.make`.
export default ExcalidrawPlugin;
