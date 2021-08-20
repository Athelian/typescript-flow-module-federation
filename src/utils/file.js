// @flow
import type { FileType, File } from 'generated/graphql';
import {
  ORDER_DOCUMENT_GET,
  ORDER_DOCUMENT_GET_TYPE_PO,
  ORDER_DOCUMENT_GET_TYPE_PI,
  ORDER_DOCUMENT_CREATE,
  ORDER_DOCUMENT_DELETE,
  ORDER_SET_DOCUMENTS,
  ORDER_UPDATE,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_DOCUMENT_CREATE,
  ORDER_ITEMS_DOCUMENT_DELETE,
  ORDER_ITEMS_SET_DOCUMENTS,
  ORDER_ITEMS_UPDATE,
} from 'modules/permission/constants/orderItem';
import {
  SHIPMENT_DOCUMENT_GET,
  SHIPMENT_DOCUMENT_GET_TYPE_BL,
  SHIPMENT_DOCUMENT_GET_TYPE_INVOICE,
  SHIPMENT_DOCUMENT_GET_TYPE_PACKING_LIST,
  SHIPMENT_DOCUMENT_GET_TYPE_IMPORT_DECLARATION,
  SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_APPLICATION,
  SHIPMENT_DOCUMENT_GET_TYPE_WAREHOUSE_ARRIVAL_REPORT,
  SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_REPORT,
  SHIPMENT_DOCUMENT_CREATE,
  SHIPMENT_DOCUMENT_DELETE,
  SHIPMENT_DOCUMENT_SET,
  SHIPMENT_SET,
  SHIPMENT_UPDATE,
} from 'modules/permission/constants/shipment';
import {
  MILESTONE_UPDATE,
  MILESTONE_DOCUMENT_CREATE,
  MILESTONE_DOCUMENT_DELETE,
  MILESTONE_SET_DOCUMENTS,
} from 'modules/permission/constants/milestone';
import {
  PRODUCT_DOCUMENT_GET,
  PRODUCT_DOCUMENT_GET_TYPE_SPECIFICATION,
  PRODUCT_DOCUMENT_GET_TYPE_ANALYSIS_CERTIFICATE,
  PRODUCT_DOCUMENT_GET_TYPE_ORIGIN_CERTIFICATE,
  PRODUCT_SET_DOCUMENTS,
  PRODUCT_DOCUMENT_CREATE,
  PRODUCT_DOCUMENT_DELETE,
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_DOCUMENT_CREATE,
  PRODUCT_PROVIDER_DOCUMENT_DELETE,
  PRODUCT_PROVIDER_SET_DOCUMENTS,
} from 'modules/permission/constants/product';

import { DOCUMENT_GET, DOCUMENT_UPDATE } from 'modules/permission/constants/file';

export function canViewFile(hasPermissions: Function, type: FileType) {
  switch (type) {
    case 'OrderPo':
      return hasPermissions([DOCUMENT_GET, ORDER_DOCUMENT_GET, ORDER_DOCUMENT_GET_TYPE_PO]);
    case 'OrderPi':
      return hasPermissions([DOCUMENT_GET, ORDER_DOCUMENT_GET, ORDER_DOCUMENT_GET_TYPE_PI]);
    case 'ShipmentBl':
      return hasPermissions([DOCUMENT_GET, SHIPMENT_DOCUMENT_GET, SHIPMENT_DOCUMENT_GET_TYPE_BL]);
    case 'ShipmentInvoice':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_INVOICE,
      ]);
    case 'ShipmentPackingList':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_PACKING_LIST,
      ]);
    case 'ShipmentImportDeclaration':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_IMPORT_DECLARATION,
      ]);
    case 'ShipmentInspectionApplication':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_APPLICATION,
      ]);
    case 'ShipmentWarehouseArrivalReport':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_WAREHOUSE_ARRIVAL_REPORT,
      ]);
    case 'ShipmentWarehouseInspectionReport':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_REPORT,
      ]);
    case 'ProductSpec':
      return hasPermissions([
        DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET_TYPE_SPECIFICATION,
      ]);
    case 'ProductAnalysisCert':
      return hasPermissions([
        DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET_TYPE_ANALYSIS_CERTIFICATE,
      ]);
    case 'ProductOriginCert':
      return hasPermissions([
        DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET,
        PRODUCT_DOCUMENT_GET_TYPE_ORIGIN_CERTIFICATE,
      ]);

    default:
      return hasPermissions(DOCUMENT_GET);
  }
}

/**
 * Checks if a user can change the parent of a file.
 * Basically just checks if the user can update / remove files from
 * the file's parent
 */
export function canChangeFileParent(hasPermissions: Function, file: File) {
  switch (file?.entity?.__typename) {
    case 'Order':
      return (
        hasPermissions([ORDER_UPDATE, ORDER_SET_DOCUMENTS]) ||
        (hasPermissions(ORDER_DOCUMENT_CREATE) && hasPermissions(ORDER_DOCUMENT_DELETE))
      );
    case 'OrderItem':
      return (
        hasPermissions([ORDER_ITEMS_UPDATE, ORDER_ITEMS_SET_DOCUMENTS]) ||
        (hasPermissions(ORDER_ITEMS_DOCUMENT_CREATE) && hasPermissions(ORDER_ITEMS_DOCUMENT_DELETE))
      );
    case 'Shipment':
      return (
        hasPermissions([SHIPMENT_SET, SHIPMENT_UPDATE, SHIPMENT_DOCUMENT_SET]) ||
        (hasPermissions(SHIPMENT_DOCUMENT_CREATE) && hasPermissions(SHIPMENT_DOCUMENT_DELETE))
      );
    case 'Milestone':
      return (
        hasPermissions([MILESTONE_UPDATE, MILESTONE_SET_DOCUMENTS]) ||
        (hasPermissions(MILESTONE_DOCUMENT_CREATE) && hasPermissions(MILESTONE_DOCUMENT_DELETE))
      );
    case 'ProductProvider': {
      const canSetProduct =
        hasPermissions(PRODUCT_SET_DOCUMENTS) ||
        hasPermissions(PRODUCT_DOCUMENT_CREATE) ||
        hasPermissions(PRODUCT_DOCUMENT_DELETE);
      const canSetProductProvider =
        hasPermissions([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_SET_DOCUMENTS]) ||
        (hasPermissions(PRODUCT_PROVIDER_DOCUMENT_CREATE) &&
          hasPermissions(PRODUCT_PROVIDER_DOCUMENT_DELETE));
      return canSetProduct && canSetProductProvider;
    }
    default:
      return hasPermissions(DOCUMENT_UPDATE);
  }
}

export const formatFilesToArray = (files: any) => {
  if (Array.isArray(files)) {
    return files;
  }

  if (files.id) {
    return [files];
  }

  return Object.values(files);
};

export default canViewFile;
