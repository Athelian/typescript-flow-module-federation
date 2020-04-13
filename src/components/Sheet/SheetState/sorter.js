// @flow
import type { SortDirection } from 'types';

export function stringSort(a: string | null, b: string | null): number {
  if (a === null && b === null) {
    return 0;
  }
  if (a === null) {
    return -1;
  }
  if (b === null) {
    return 1;
  }

  return a.localeCompare(b);
}

export function numberSort(a: number | null, b: number | null): number {
  if (a === null && b === null) {
    return 0;
  }
  if (a === null) {
    return -1;
  }
  if (b === null) {
    return 1;
  }

  return a - b;
}

export function dateSort(a: Date | string | null, b: Date | string | null): number {
  if (a === null && b === null) {
    return 0;
  }
  if (a === null) {
    return -1;
  }
  if (b === null) {
    return 1;
  }

  return new Date(a) - new Date(b);
}

export function defaultSort(a: Object, b: Object): number {
  return a.sort - b.sort;
}

export function setDirection(result: number, direction?: SortDirection): number {
  return direction === 'DESCENDING' ? -result : result;
}
