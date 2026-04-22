//
// Copyright 2024 DXOS.org
//

import { useEffect, useState } from 'react';

import { createDocAccessor } from '@dxos/echo-db';
import { invariant } from '@dxos/invariant';
import { log } from '@dxos/log';

import { EXCALIDRAW_SCHEMA, type Excalidraw } from '#types';

import { ExcalidrawStoreAdapter, type ExcalidrawStoreAdapterProps } from './adapter';

export const useStoreAdapter = (object?: Excalidraw.Excalidraw, options: ExcalidrawStoreAdapterProps = {}) => {
  const [adapter] = useState(new ExcalidrawStoreAdapter(options));
  const [_, forceUpdate] = useState({});
  // `object.canvas.target` is a Ref and resolves lazily — re-run the effect once it
  // populates, otherwise we early-return before the canvas is ready and silently
  // leave the adapter closed.
  const canvasTarget = object?.canvas.target;
  const canvasSchema = canvasTarget?.schema;

  useEffect(() => {
    if (!object || !canvasTarget) {
      return;
    }

    if (canvasSchema !== EXCALIDRAW_SCHEMA) {
      log.warn('unexpected canvas schema', { schema: canvasSchema, expected: EXCALIDRAW_SCHEMA });
      return;
    }

    const t = setTimeout(async () => {
      invariant(object.canvas);
      const accessor = createDocAccessor(canvasTarget, ['content']);
      await adapter.open(accessor);
      forceUpdate({});
    });

    return () => {
      clearTimeout(t);
      void adapter.close();
    };
  }, [object, canvasTarget, canvasSchema]);

  return adapter;
};
