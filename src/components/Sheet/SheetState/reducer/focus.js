// @flow
import type { CellValue, State, Position } from 'components/Sheet/SheetState/types';
import { findEquivalentCellPosition, resolveAreasBy } from './helper';

function getSafePosition(position: Position, rows: Array<Array<CellValue>>): Position {
  return {
    x: Math.max(0, Math.min(position.x, rows.length - 1)),
    y: Math.max(0, Math.min(position.y, rows[0].length - 1)),
  };
}

function getNextFocusable(
  rows: Array<Array<CellValue>>,
  current: Position,
  next: Position
): Position | null {
  const safe = getSafePosition(next, rows);
  if (next.x !== safe.x || next.y !== safe.y) {
    return current;
  }

  const cell = rows[next.x][next.y];

  if (cell.merged) {
    if (cell.merged.from.x === current.x && cell.merged.from.y === current.y) {
      /**
       * Seems we are navigating inside the same merge cell,
       * so we try to focus the next bottom cell.
       */
      return getNextFocusable(rows, current, {
        x: cell.merged.to.x + 1,
        y: cell.merged.to.y,
      });
    }

    return cell.merged.from;
  }

  return next;
}

export function focus(state: State, target: CellValue, position: Position): State {
  if (state.focusAt?.cell === target) {
    return state;
  }

  const area = target.merged || { from: position, to: position };

  const weakFocusAt =
    target.duplicable && target.entity && target.data
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
    focusAt: {
      ...area,
      cell: target,
    },
    weakFocusAt,
  };
}

export function blur(state: State): State {
  if (!state.focusAt) {
    return state;
  }

  return {
    ...state,
    focusAt: null,
    weakFocusAt: [],
  };
}

export function reFocus(state: State, payload: { cell: CellValue }): State {
  const { cell } = payload;
  const pos = findEquivalentCellPosition(state.rows, cell);

  return pos ? focus(state, state.rows[pos.x][pos.y], pos) : blur(state);
}

export function focusUp(state: State) {
  if (!state.focusAt) {
    return state;
  }

  const pos = getNextFocusable(state.rows, state.focusAt.from, {
    x: state.focusAt.from.x - 1,
    y: state.focusAt.from.y,
  });
  if (!pos) {
    return state;
  }

  return focus(state, state.rows[pos.x][pos.y], pos);
}

export function focusDown(state: State) {
  if (!state.focusAt) {
    return state;
  }

  const pos = getNextFocusable(state.rows, state.focusAt.from, {
    x: state.focusAt.from.x + 1,
    y: state.focusAt.from.y,
  });
  if (!pos) {
    return state;
  }

  return focus(state, state.rows[pos.x][pos.y], pos);
}

export function focusRight(state: State) {
  if (!state.focusAt) {
    return state;
  }

  const pos = getNextFocusable(state.rows, state.focusAt.from, {
    x: state.focusAt.from.x,
    y: state.focusAt.from.y + 1,
  });
  if (!pos) {
    return state;
  }

  return focus(state, state.rows[pos.x][pos.y], pos);
}

export function focusLeft(state: State) {
  if (!state.focusAt) {
    return state;
  }

  const pos = getNextFocusable(state.rows, state.focusAt.from, {
    x: state.focusAt.from.x,
    y: state.focusAt.from.y - 1,
  });
  if (!pos) {
    return state;
  }

  return focus(state, state.rows[pos.x][pos.y], pos);
}
