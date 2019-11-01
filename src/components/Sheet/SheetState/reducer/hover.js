// @flow
import type { CellValue, State, Position } from 'components/Sheet/SheetState/types';

export function hover(state: State, target: CellValue, pos: Position): State {
  return {
    ...state,
    hoverAt: target.merged || { from: pos, to: pos },
  };
}

export function unhover(state: State): State {
  if (!state.hoverAt) {
    return state;
  }

  return {
    ...state,
    hoverAt: null,
  };
}
