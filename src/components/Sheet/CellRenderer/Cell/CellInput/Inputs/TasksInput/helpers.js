// @flow

import { orderTasksQuery, orderItemTasksQuery, batchTasksQuery, shipmentTasksQuery } from './query';

export const getTaskQuery = (entityType: string) => {
  switch (entityType) {
    case 'order':
      return orderTasksQuery;
    case 'orderItem':
      return orderItemTasksQuery;
    case 'batch':
      return batchTasksQuery;
    default:
      return shipmentTasksQuery;
  }
};

export const getTasksFromQueryData = (entityType: string, data: Object) => {
  let key = 'shipmentsByIDs';

  switch (entityType) {
    case 'order':
      key = 'ordersByIds';
      break;
    case 'orderItem':
      key = 'orderItemsByIds';
      break;
    case 'batch':
      key = 'batchesByIDs';
      break;
    default:
  }

  return {
    tasks: data?.[key]?.[0]?.todo?.tasks ?? [],
    taskTemplate: data?.[key]?.[0]?.todo?.taskTemplate ?? null,
  };
};
