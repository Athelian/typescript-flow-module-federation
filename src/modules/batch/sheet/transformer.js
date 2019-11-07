// @flow
import type { Batch } from 'generated/graphql';
import type { CellValue } from 'components/Sheet/SheetState/types';

export default function transformer(index: number, batch: Batch): Array<Array<CellValue>> {
  console.warn({
    index,
    batch,
  });
  const rows = [];

  return rows;
}
