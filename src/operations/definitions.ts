//
// Copyright 2025 DXOS.org
//

import * as Schema from 'effect/Schema';

import { Operation } from '@dxos/operation';

import { meta } from '#meta';
import { Excalidraw } from '#types';

const EXCALIDRAW_OPERATION = `${meta.id}.operation`;

export const Create = Operation.make({
  meta: { key: `${EXCALIDRAW_OPERATION}.create`, name: 'Create Excalidraw' },
  input: Schema.Struct({
    name: Schema.optional(Schema.String),
    schema: Schema.optional(Schema.String),
    content: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Any })),
  }),
  output: Schema.Struct({
    object: Excalidraw.Excalidraw,
  }),
});
