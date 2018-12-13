// @flow
export const toFloat = (value: any): number =>
  Number.isNaN(Number.parseFloat(value)) ? 0 : Number.parseFloat(value);

export const toFloatNullable = (value: any): any =>
  Number.isNaN(Number.parseFloat(value)) ? undefined : Number.parseFloat(value);

export const countDecimal = (value: number) =>
  Math.floor(value) === value ? 0 : value.toString().split('.')[1].length || 0;
