// @flow
import type { FileType } from 'generated/graphql';
import {
  ORDER_DOCUMENT_GET,
  ORDER_DOCUMENT_GET_TYPE_PO,
  ORDER_DOCUMENT_GET_TYPE_PI,
} from 'modules/permission/constants/order';
import {
  PRODUCT_DOCUMENT_GET,
  PRODUCT_DOCUMENT_GET_TYPE_SPECIFICATION,
  PRODUCT_DOCUMENT_GET_TYPE_ANALYSIS_CERTIFICATE,
  PRODUCT_DOCUMENT_GET_TYPE_ORIGIN_CERTIFICATE,
} from 'modules/permission/constants/product';
import {
  SHIPMENT_DOCUMENT_GET,
  SHIPMENT_DOCUMENT_GET_TYPE_BL,
  SHIPMENT_DOCUMENT_GET_TYPE_INVOICE,
  SHIPMENT_DOCUMENT_GET_TYPE_PACKING_LIST,
  SHIPMENT_DOCUMENT_GET_TYPE_IMPORT_DECLARATION,
  SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_APPLICATION,
  SHIPMENT_DOCUMENT_GET_TYPE_WAREHOUSE_ARRIVAL_REPORT,
  SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_REPORT,
} from 'modules/permission/constants/shipment';
import { DOCUMENT_GET } from 'modules/permission/constants/file';

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
