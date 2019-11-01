// @flow
import type { Area } from '../SheetState/types';

export function isInArea(area: Area, columnIndex: number, rowIndex: number): boolean {
  return (
    area.from.x <= rowIndex &&
    area.to.x >= rowIndex &&
    area.from.y <= columnIndex &&
    area.to.y >= columnIndex
  );
}
