// @flow
import { HIDE, NAVIGABLE, READONLY } from 'modules/batch/constants';

export type ItemConfigType = typeof HIDE | typeof NAVIGABLE | typeof READONLY;
export type ShipmentConfigType = typeof HIDE | typeof NAVIGABLE;
export type ContainerConfigType = typeof HIDE | typeof NAVIGABLE;
export type OrderConfigType = typeof HIDE | typeof NAVIGABLE;
