//
// Copyright 2026 DXOS.org
//

import './theme.css';

import { Plugin } from '@dxos/app-framework';

import { GameVariant, OperationHandler, PluginAsset, Schema, Translations } from '#capabilities';
import { meta } from '#meta';

export const TicTacToePlugin = Plugin.define(meta).pipe(
  Plugin.addModule(GameVariant),
  Plugin.addModule(OperationHandler),
  Plugin.addModule(PluginAsset),
  Plugin.addModule(Schema),
  Plugin.addModule(Translations),
  Plugin.make,
);

export default TicTacToePlugin;
