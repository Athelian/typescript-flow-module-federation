// @flow

export type EntityTypes = 'order' | 'item' | 'batch' | 'shipment';

export type ActiveFilters = {
  order: Array<string>,
  item: Array<string>,
  batch: Array<string>,
  shipment: Array<string>,
};

export type FilterToggles = {
  order: {
    completelyBatched: boolean,
    completelyShipped: boolean,
    showActive: boolean,
    showArchived: boolean,
  },
  item: {},
  batch: {
    showActive: boolean,
    showArchived: boolean,
  },
  shipment: {
    showActive: boolean,
    showArchived: boolean,
  },
};
