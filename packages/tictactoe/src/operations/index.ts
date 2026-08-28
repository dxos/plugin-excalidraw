//
// Copyright 2026 DXOS.org
//

import { Operation, OperationHandlerSet } from '@dxos/compute';

import { TicTacToeOperation } from '#types';

export const TicTacToeOperationHandlerSet = OperationHandlerSet.lazy([
  TicTacToeOperation.MakeMove.pipe(Operation.lazyHandler(() => import('./move'))),
  TicTacToeOperation.AiMove.pipe(Operation.lazyHandler(() => import('./ai-move'))),
  TicTacToeOperation.Print.pipe(Operation.lazyHandler(() => import('./print'))),
]);
