// @flow
import type { SortDirection } from 'types';

export function stringSort(a: string, b: string): number {
  return (a || '').localeCompare(b);
}

export function numberSort(a: number, b: number): number {
  return a - b;
}

export function dateSort(a: Date | string, b: Date | string): number {
  return new Date(a) - new Date(b);
}

export function defaultSort(a: Object, b: Object): number {
  return a.sort - b.sort;
}

export function setDirection(result: number, direction?: SortDirection): number {
  return direction === 'DESCENDING' ? -result : result;
}
