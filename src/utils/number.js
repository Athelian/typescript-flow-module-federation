// @flow
import { plus, minus, times, divide } from 'number-precision';

export { plus, minus, times, divide };

export const toFloat = (value: any): number =>
  Number.isNaN(Number.parseFloat(value)) ? 0 : Number.parseFloat(value);

export const toFloatNullable = (value: any): any =>
  Number.isNaN(Number.parseFloat(value)) ? null : Number.parseFloat(value);

export const countDecimal = (value: number) =>
  Math.floor(value) === value ? 0 : value.toString().split('.')[1].length || 0;
