//
// Copyright 2024 DXOS.org
//

import { useEffect, useState } from 'react';

import { createDocAccessor } from '@dxos/echo-db';
import { useObject } from '@dxos/echo-react';

import { type Excalidraw } from '#types';

import { ExcalidrawStoreAdapter, type ExcalidrawStoreAdapterProps } from './adapter';

export const useStoreAdapter = (object?: Excalidraw.Excalidraw, options: ExcalidrawStoreAdapterProps = {}) => {
  const [adapter] = useState(new ExcalidrawStoreAdapter(options));
  const [_, forceUpdate] = useState({});
  // `useObject` subscribes to the Ref and re-renders when the canvas resolves, so the
  // effect below fires once with a real target instead of relying on `.target` (which
  // doesn't notify React of its async load).
  const [canvas] = useObject(object?.canvas);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const t = setTimeout(async () => {
      const accessor = createDocAccessor(canvas, ['content']);
      await adapter.open(accessor);
      forceUpdate({});
    });

    return () => {
      clearTimeout(t);
      void adapter.close();
    };
  }, [canvas]);

  return adapter;
};
