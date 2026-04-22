//
// Copyright 2023 DXOS.org
//

import { type Atom } from '@effect-atom/atom-react';

import { Capability } from '@dxos/app-framework';

import { meta } from '#meta';

import * as Settings from './Settings';

export const EXCALIDRAW_SCHEMA = 'excalidraw.com/2';

export namespace ExcalidrawCapabilities {
  export const Settings = Capability.make<Atom.Writable<Settings.Settings>>(`${meta.id}.capability.settings`);
}

export * as Excalidraw from './Excalidraw';
export * as Settings from './Settings';
