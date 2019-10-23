// @flow
import matchSorter from 'match-sorter';

export const itemToString = (i: ?Object) => (i ? `${i.code} - ${i.name}` : '');
export const itemToValue = (i: ?Object) => i?.code ?? null;

export const filterItems = (q: string, options: Array<Object>): Array<Object> => {
  return matchSorter(options, q, {
    keys: ['code', 'name', itemToString],
  });
};
