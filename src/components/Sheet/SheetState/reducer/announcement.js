// @flow
import type { Area, CellValue, State } from '../types';
import { replaceItem } from './mutate';

function isOverlap(a: Area, b: Area) {
  return a.from.x <= b.from.x && a.from.y <= b.from.y && a.to.x >= b.to.x && a.to.y >= b.to.y;
}

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

        /**
         * We copy the copy cell area and set `to` to the end right of the sheet.
         * This is for correctly detect overlapping announcements.
         */
        const cellArea = {
          from: { x, y, ...(cell.merged?.from ?? {}) },
          to: { x, y, ...(cell.merged?.to ?? {}) },
        };
        cellArea.to.y = newState.rows.length - 1;

        const biggerAdd = newState.addedRows.find(rc => isOverlap(rc, cellArea));
        if (biggerAdd) {
          return false;
        }

        const remove = newState.removedRows.find(rc => isOverlap(rc, cellArea));
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
        ...newState.addedRows.filter(rc => !isOverlap(area, rc)),
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

      /**
       * We copy the copy cell area and set `to` to the end right of the sheet.
       * This is for correctly detect overlapping announcements.
       */
      const cellArea = {
        from: { x, y, ...(cell.merged?.from ?? {}) },
        to: { x, y, ...(cell.merged?.to ?? {}) },
      };
      cellArea.to.y = state.rows.length - 1;

      const biggerRemove = state.removedRows.find(rc => isOverlap(rc, cellArea));
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
      ...state.removedRows.filter(rc => !isOverlap(area, rc)),
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
