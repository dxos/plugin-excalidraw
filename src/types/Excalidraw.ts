//
// Copyright 2026 DXOS.org
//
// Own data schema for the Excalidraw plugin. Previously this plugin shared the
// `Sketch` schema from `@dxos/plugin-sketch`, which transitively pulled in the
// tldraw runtime and caused a "multiple tldraw versions installed" warning when
// the bundle ended up linking both our excalidraw path and plugin-sketch's
// tldraw path against different tldraw versions. Owning the schema here severs
// that dependency.
//

// @import-as-namespace

import * as Schema from 'effect/Schema';

import { Annotation, Obj, Ref, Type } from '@dxos/echo';
import { FormInputAnnotation, SystemTypeAnnotation } from '@dxos/echo/internal';

/** Schema identifier embedded in the persisted canvas payload. */
export const EXCALIDRAW_SCHEMA = 'excalidraw.com/2';

/**
 * Persisted Excalidraw canvas. `content` is an opaque map of ElementId → ExcalidrawElement
 * managed by {@link ExcalidrawStoreAdapter}; we treat it as JSON-compatible data so the
 * ECHO/Automerge layer can CRDT-merge incremental changes without knowing the shape.
 */
export const Canvas = Schema.Struct({
  /** Versioning tag so the adapter can detect payloads it doesn't understand. */
  schema: Schema.String.pipe(Schema.optional),
  content: Schema.Record({ key: Schema.String, value: Schema.Any }),
}).pipe(
  Type.object({
    typename: 'org.dxos.type.excalidraw.canvas',
    version: '0.1.0',
  }),
  SystemTypeAnnotation.set(true),
);
export interface Canvas extends Schema.Schema.Type<typeof Canvas> {}

/** The user-facing Excalidraw object — a named handle around a canvas. */
export const Excalidraw = Schema.Struct({
  name: Schema.String.pipe(Schema.optional),
  canvas: Ref.Ref(Canvas).pipe(FormInputAnnotation.set(false)),
}).pipe(
  Type.object({
    typename: 'org.dxos.type.excalidraw',
    version: '0.1.0',
  }),
  Annotation.IconAnnotation.set({
    icon: 'ph--compass-tool--regular',
    hue: 'indigo',
  }),
);
export interface Excalidraw extends Schema.Schema.Type<typeof Excalidraw> {}

export type ExcalidrawProps = Omit<Obj.MakeProps<typeof Excalidraw>, 'canvas'> & {
  canvas?: Partial<Obj.MakeProps<typeof Canvas>>;
};

/** Construct a new Excalidraw + Canvas pair, linked by Ref. */
export const make = ({ canvas: canvasProps, ...props }: ExcalidrawProps = {}) => {
  const { schema = EXCALIDRAW_SCHEMA, content = {} } = canvasProps ?? {};
  const canvas = Obj.make(Canvas, { schema, content });
  return Obj.make(Excalidraw, { ...props, canvas: Ref.make(canvas) });
};

/** Runtime type guard; checks the schema tag against the default/expected value. */
export const isExcalidraw = (object: any, _schema: string = EXCALIDRAW_SCHEMA): object is Excalidraw =>
  Schema.is(Excalidraw)(object);
