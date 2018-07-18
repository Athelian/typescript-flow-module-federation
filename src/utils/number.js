// @flow
import { is } from 'ramda';

export const toFloat = (value: any): number =>
  (is(Number, value) ? value : Number.parseFloat(value)) || 0;

export const countDecimal = (value: number) =>
  Math.floor(value) === value ? 0 : value.toString().split('.')[1].length || 0;
