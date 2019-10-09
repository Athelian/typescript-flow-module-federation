// @flow
import matchSorter from 'match-sorter';
import type { PortOption } from './hooks';

export const itemToString = (i: ?PortOption) => (i ? `${i.code} - ${i.name}` : '');
export const itemToValue = (i: ?PortOption) =>
  i ? { [i.transportType === 'Sea' ? 'seaport' : 'airport']: i.code } : {};

export const filterItems = (q: string, options: Array<PortOption>): Array<PortOption> => {
  return matchSorter(options, q, {
    keys: ['code', 'name', itemToString],
  });
};
