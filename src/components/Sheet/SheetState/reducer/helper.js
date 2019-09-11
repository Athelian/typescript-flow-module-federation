// @flow
import type { Area, CellValue, Position } from '../types';

export function resolveAreasBy(
  rows: Array<Array<CellValue>>,
  fn: CellValue => boolean
): Array<Area> {
  return rows.reduce((areas, row, x) => {
    row.forEach((cell, y) => {
      if (fn(cell)) {
        areas.push(cell.merged || { from: { x, y }, to: { x, y } });
      }
    });

    return areas;
  }, []);
}

export function findPositionBy(
  rows: Array<Array<CellValue>>,
  callback: CellValue => boolean
): Position | null {
  let pos = null;

  rows.every((row, x) =>
    row.every((cell, y) => {
      if (callback(cell)) {
        pos = { x, y };
        return false;
      }
      return true;
    })
  );

  return pos;
}

export function findEquivalentCellPosition(
  rows: Array<Array<CellValue>>,
  cell: CellValue
): Position | null {
  if (!cell.entity || !cell.data) {
    return null;
  }

  return (
    findPositionBy(
      rows,
      c =>
        c.data?.path === cell.data?.path &&
        c.entity?.id === cell.entity?.id &&
        c.entity?.type === cell.entity?.type &&
        c.data?.field === cell.data?.field
    ) ||
    findPositionBy(
      rows,
      c =>
        c.entity?.id === cell.entity?.id &&
        c.entity?.type === cell.entity?.type &&
        c.data?.field === cell.data?.field
    )
  );
}
