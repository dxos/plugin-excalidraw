//
// Copyright 2025 DXOS.org
//

import * as Effect from 'effect/Effect';

import { Operation } from '@dxos/operation';

import { EXCALIDRAW_SCHEMA, Excalidraw } from '../types';
import { Create } from './definitions';

const handler: Operation.WithHandler<typeof Create> = Create.pipe(
  Operation.withHandler(({ name, schema = EXCALIDRAW_SCHEMA, content = {} }) =>
    Effect.succeed({
      object: Excalidraw.make({ name, canvas: { schema, content } }),
    }),
  ),
);

export default handler;
