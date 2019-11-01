// @flow
import type { CellValue, State, Position } from 'components/Sheet/SheetState/types';
import { findEquivalentCellPosition, resolveAreasBy } from './helper';

export function setError(
  state: State,
  payload: { messages: Array<string> },
  target: CellValue,
  position: Position
): State {
  const area = target.merged || { from: position, to: position };

  const { messages } = payload;

  const weakErrorAt =
    target.duplicatable && target.entity && target.data
      ? resolveAreasBy(
          state.rows,
          (cell: CellValue): boolean =>
            cell.entity?.id === target.entity?.id &&
            cell.entity?.type === target.entity?.type &&
            cell.data?.field === target.data?.field
        )
      : [];

  return {
    ...state,
    errorAt: {
      ...area,
      cell: target,
      messages,
    },
    weakErrorAt,
  };
}

export function clearError(state: State): State {
  return {
    ...state,
    errorAt: null,
    weakErrorAt: [],
  };
}

export function reError(
  state: State,
  payload: { messages: Array<string>, cell: CellValue }
): State {
  const { cell, messages } = payload;
  const pos = findEquivalentCellPosition(state.rows, cell);

  return pos ? setError(state, { messages }, state.rows[pos.x][pos.y], pos) : clearError(state);
}
