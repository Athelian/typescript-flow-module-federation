// @flow
import type { CellValue, ForeignFocus, State } from '../types';
import { resolveAreasBy } from './helper';

function resolveForeignFocuses(focus: Object, rows: Array<Array<CellValue>>): Array<ForeignFocus> {
  return resolveAreasBy(
    rows,
    (cell: CellValue): boolean =>
      cell.entity?.id === focus.entity.id &&
      cell.entity?.type === focus.entity.__typename &&
      cell.data?.field === focus.field
  ).map(area => ({
    id: focus.id,
    user: focus.user,
    /* $FlowFixMe This comment suppresses an error found when upgrading Flow to
     * v0.111.0. To view the error, delete this comment and run Flow. */
    ...area,
  }));
}

export function setForeignFocuses(state: State, payload: { foreignFocuses: Array<Object> }): State {
  const { foreignFocuses } = payload;

  const foreignFocusesAt = foreignFocuses
    .map(focus => resolveForeignFocuses(focus, state.rows))
    // $FlowFixMe flow doesn't support flat()
    .flat();

  return {
    ...state,
    foreignFocuses,
    foreignFocusesAt,
  };
}

export function appendForeignFocuses(
  state: State,
  payload: { foreignFocuses: Array<Object> }
): State {
  const { foreignFocuses } = payload;

  return setForeignFocuses(state, {
    foreignFocuses: [
      ...state.foreignFocuses.filter(
        ff => foreignFocuses.findIndex(focus => focus.id === ff.id) === -1
      ),
      ...foreignFocuses,
    ],
  });
}

export function foreignFocus(state: State, payload: { focus: Object }): State {
  const { focus } = payload;

  const foreignFocusesAt = resolveForeignFocuses(focus, state.rows);

  return {
    ...state,
    foreignFocuses: [...state.foreignFocuses.filter(ff => ff.id !== focus.id), focus],
    foreignFocusesAt: [
      ...state.foreignFocusesAt.filter(ff => ff.id !== focus.id),
      ...foreignFocusesAt,
    ],
  };
}

export function foreignBlur(state: State, payload: { blur: Object }): State {
  const { blur } = payload;

  return {
    ...state,
    foreignFocuses: [...state.foreignFocuses.filter(ff => ff.id !== blur.id)],
    foreignFocusesAt: [...state.foreignFocusesAt.filter(ff => ff.id !== blur.id)],
  };
}
