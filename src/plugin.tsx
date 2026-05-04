//
// Copyright 2023 DXOS.org
//

import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';

import { Plugin } from '@dxos/app-framework';
import { AppPlugin } from '@dxos/app-toolkit';
import { Annotation } from '@dxos/echo';
import { Operation } from '@dxos/operation';
import { SpaceOperation } from '@dxos/plugin-space/operations';
import { type CreateObject } from '@dxos/plugin-space/types';

import { ExcalidrawSettings, OperationHandler, ReactSurface } from '#capabilities';
import { meta } from '#meta';
import { Excalidraw } from '#types';

import { translations } from './translations';

// Default export is the entry the community registry loader expects: a Plugin
// (or zero-arg factory). `Plugin.make` at the end of the pipe produces one.
export default Plugin.define(meta).pipe(
  AppPlugin.addMetadataModule({
    metadata: {
      id: Excalidraw.Excalidraw.typename,
      metadata: {
        icon: Annotation.IconAnnotation.get(Excalidraw.Excalidraw).pipe(Option.getOrThrow).icon,
        iconHue: Annotation.IconAnnotation.get(Excalidraw.Excalidraw).pipe(Option.getOrThrow).hue ?? 'white',
        createObject: ((props, options) =>
          Effect.gen(function* () {
            const object = Excalidraw.make(props);
            return yield* Operation.invoke(SpaceOperation.AddObject, {
              object,
              target: options.target,
              hidden: true,
              targetNodeId: options.targetNodeId,
            });
          })) satisfies CreateObject,
      },
    },
  }),
  AppPlugin.addOperationHandlerModule({ activate: OperationHandler }),
  AppPlugin.addSchemaModule({ schema: [Excalidraw.Canvas, Excalidraw.Excalidraw] }),
  AppPlugin.addSettingsModule({ id: 'settings', activate: ExcalidrawSettings }),
  AppPlugin.addSurfaceModule({ activate: ReactSurface }),
  AppPlugin.addTranslationsModule({ translations }),
  Plugin.make,
);
