// @flow
import type { ColumnSort } from 'components/Sheet/SheetState/types';
import { Batch } from 'generated/graphql';

export default function sorter(batches: Array<Batch>, sorts: Array<ColumnSort>): Array<Batch> {
  console.warn({
    batches,
    sorts,
  });
  return batches;
}
