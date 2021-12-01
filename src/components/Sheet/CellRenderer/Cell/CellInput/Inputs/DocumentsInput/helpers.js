// @flow
import {
  orderDocumentsQuery,
  orderItemDocumentsQuery,
  productProviderDocumentsQuery,
  milestoneDocumentsQuery,
  shipmentDocumentsQuery,
} from './query';
import { DocumentInputEntityTypes } from '.';

export const getDocumentQuery = (entityType: DocumentInputEntityTypes) => {
  switch (entityType) {
    case 'Order':
      return orderDocumentsQuery;
    case 'OrderItem':
      return orderItemDocumentsQuery;
    case 'Shipment':
      return shipmentDocumentsQuery;
    case 'ProductProvider':
      return productProviderDocumentsQuery;
    default:
      return milestoneDocumentsQuery;
  }
};

export const getDocumentsFromQueryData = (entityType: DocumentInputEntityTypes, data: Object) => {
  let key = 'shipmentsByIDs';

  switch (entityType) {
    case 'Order':
      key = 'ordersByIds';
      break;
    case 'OrderItem':
      key = 'orderItemsByIds';
      break;
    case 'Milestone':
      key = 'milestonesByIDs';
      break;
    case 'ProductProvider':
      key = 'productProvidersByIDs';
      break;
    default:
  }

  return {
    files: data?.[key]?.[0]?.files ?? [],
  };
};
