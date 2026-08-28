//
// Copyright 2026 DXOS.org
//

import { describe, test } from 'vitest';

import * as ClientPlugin from '@dxos/plugin-client/ClientPlugin';
import * as GamePlugin from '@dxos/plugin-game/GamePlugin';
import { createComposerTestApp } from '@dxos/plugin-testing/harness';

import { meta } from '#meta';
import { TicTacToePlugin } from '#plugin';
import { TicTacToeOperation } from '#types';

const moduleId = (name: string) => `${meta.profile.key}.module.${name}`;

describe('TicTacToePlugin', () => {
  test('modules activate on the expected events', async ({ expect }) => {
    await using harness = await createComposerTestApp({
      plugins: [ClientPlugin.make({}), GamePlugin.make(), TicTacToePlugin()],
    });

    expect(harness.manager.getActive()).toEqual(
      expect.arrayContaining([moduleId('GameVariant'), moduleId('schema'), moduleId('OperationHandler')]),
    );
  });

  test('invokes the Print operation via the invoker capability', async ({ expect }) => {
    await using harness = await createComposerTestApp({ plugins: [GamePlugin.make(), TicTacToePlugin()] });
    const { ascii } = await harness.invoke(TicTacToeOperation.Print, { board: 'XO-------', size: 3 });
    expect(ascii).toContain('| X | O |');
  });
});
