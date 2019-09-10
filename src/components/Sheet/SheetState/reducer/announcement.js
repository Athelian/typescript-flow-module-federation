// @flow
import type { Area, CellValue, RowChange, State } from '../types';
import { replaceItem } from './mutate';

export function preAddEntity(transformer: (number, Object) => Array<Array<CellValue>>) {
  return (
    state: State,
    payload: {
      entity: {
        id: string,
        type: string,
      },
      callback: (
        items: Array<Object>
      ) => {
        item: Object,
        index: number,
      } | null,
    }
  ): State => {
    const { entity, callback } = payload;

    const item = callback(state.items);
    if (!item) {
      return state;
    }

    const newState = replaceItem(transformer)(state, item);

    let result = null;

    newState.rows.every((row, x) => {
      return row.every((cell, y) => {
        if (cell.entity?.id !== entity.id || cell.entity?.type !== entity.type) {
          return true;
        }

        const cellArea = cell.merged || { from: { x, y }, to: { x, y } };

        const biggerAdd = newState.addedRows.find(
          (a: RowChange) =>
            a.from.x <= cellArea.from.x &&
            a.from.y <= cellArea.from.y &&
            a.to.x >= cellArea.to.x &&
            a.to.y >= cellArea.to.y
        );
        if (biggerAdd) {
          return false;
        }

        const remove = newState.removedRows.find(
          (a: RowChange) =>
            a.from.x <= cellArea.from.x &&
            a.from.y <= cellArea.from.y &&
            a.to.x >= cellArea.to.x &&
            a.to.y >= cellArea.to.y
        );
        if (remove) {
          return false;
        }
        result = cellArea;

        return false;
      });
    });

    /**
     * Seems we didn't not found our new entity.
     * If it's from an added parent entity or it's already deleted, we can skip.
     */
    if (!result) {
      return state;
    }

    const area: Area = result;

    return {
      ...newState,
      addedRows: [
        ...newState.addedRows.filter(
          (a: RowChange) =>
            a.from.x >= area.from.x &&
            a.from.y >= area.from.y &&
            a.to.x <= area.to.x &&
            a.to.y <= area.to.y
        ),
        {
          ...area,
          entity,
        },
      ],
    };
  };
}

export function postAddEntity(
  state: State,
  payload: { entity: { id: string, type: string } }
): State {
  const { entity } = payload;

  return {
    ...state,
    addedRows: state.addedRows.filter(
      row => row.entity.id !== entity.id || row.entity.type !== entity.type
    ),
  };
}

export function preRemoveEntity(
  state: State,
  payload: {
    entity: {
      id: string,
      type: string,
    },
    callback: (
      items: Array<Object>
    ) => {
      item: Object,
      index: number,
    },
  }
) {
  const { entity, callback } = payload;

  let result = null;

  state.rows.every((row, x) => {
    return row.every((cell, y) => {
      if (cell.entity?.id !== entity.id || cell.entity?.type !== entity.type) {
        return true;
      }

      const cellArea = cell.merged || { from: { x, y }, to: { x, y } };

      const biggerRemove = state.removedRows.find(
        (a: RowChange) =>
          a.from.x <= cellArea.from.x &&
          a.from.y <= cellArea.from.y &&
          a.to.x >= cellArea.to.x &&
          a.to.y >= cellArea.to.y
      );
      if (!biggerRemove) {
        result = cellArea;
      }

      return false;
    });
  });

  /**
   * Seems we didn't not found our new entity.
   * If it's from a removed parent entity, we can skip.
   */
  if (!result) {
    return state;
  }

  const area: Area = result;

  return {
    ...state,
    removedRows: [
      ...state.removedRows.filter(
        (a: RowChange) =>
          a.from.x >= area?.from.x &&
          a.from.y >= area?.from.y &&
          a.to.x <= area?.to.x &&
          a.to.y <= area?.to.y
      ),
      {
        ...area,
        entity,
        callback,
      },
    ],
  };
}

export function postRemoveEntity(transformer: (number, Object) => Array<Array<CellValue>>) {
  return (state: State, payload: { entity: { id: string, type: string } }): State => {
    const { entity } = payload;

    const removedRow = state.removedRows.find(
      row => row.entity.id === entity.id && row.entity.type === entity.type
    );
    if (!removedRow) {
      return state;
    }

    const item = removedRow.callback(state.items);
    if (!item) {
      return state;
    }

    const newState = replaceItem(transformer)(state, item);

    return {
      ...newState,
      removedRows: newState.removedRows.filter(
        row => row.entity.id !== entity.id || row.entity.type !== entity.type
      ),
    };
  };
}
