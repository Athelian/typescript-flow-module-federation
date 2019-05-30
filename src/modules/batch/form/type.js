// @flow

export const HIDE = 'hide';
export const NAVIGABLE = 'navigable';
export const READONLY = 'readOnly';

export type ItemConfigType = typeof HIDE | typeof NAVIGABLE | typeof READONLY;
export type ShipmentConfigType = typeof HIDE | typeof NAVIGABLE;
export type ContainerConfigType = typeof HIDE | typeof NAVIGABLE;
export type OrderConfigType = typeof HIDE | typeof NAVIGABLE;
