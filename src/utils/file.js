// @flow
import type { FileType, File } from 'generated/graphql';
import logger from 'utils/logger';
import {
  ORDER_DOCUMENT_GET,
  ORDER_DOCUMENT_EDIT,
  ORDER_DOCUMENT_FORM,
  ORDER_DOCUMENT_GET_TYPE_PO,
  ORDER_DOCUMENT_GET_TYPE_PI,
  ORDER_DOCUMENT_DOWNLOAD,
  ORDER_UPDATE,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_DOCUMENT_FORM,
  ORDER_ITEMS_DOCUMENT_EDIT,
  ORDER_ITEMS_DOCUMENT_DOWNLOAD,
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
  SHIPMENT_DOCUMENT_GET_TYPE_MISCELLANEOUS,
  SHIPMENT_DOCUMENT_SET_MISCELLANEOUS,
  SHIPMENT_DOCUMENT_EDIT,
  SHIPMENT_DOCUMENT_FORM,
  SHIPMENT_DOCUMENT_DOWNLOAD,
  SHIPMENT_EDIT,
} from 'modules/permission/constants/shipment';
import {
  MILESTONE_UPDATE,
  MILESTONE_DOCUMENT_EDIT,
  MILESTONE_DOCUMENT_FORM,
  MILESTONE_DOCUMENT_DOWNLOAD,
} from 'modules/permission/constants/milestone';
import {
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_DOCUMENT_EDIT,
  PRODUCT_PROVIDER_DOCUMENT_FORM,
  PRODUCT_PROVIDER_DOCUMENT_DOWNLOAD,
} from 'modules/permission/constants/product';
import {
  PARENTLESS_DOCUMENT_EDIT,
  PARENTLESS_DOCUMENT_FORM,
  PARENTLESS_DOCUMENT_DOWNLOAD,
} from 'modules/permission/constants/file';

import JsZip from 'jszip';
import FileSaver from 'file-saver';

export function canDownloadFile(hasPermissions: Function, entityType?: string) {
  if (entityType === undefined) return hasPermissions(PARENTLESS_DOCUMENT_DOWNLOAD);

  switch (entityType.charAt(0).toLowerCase() + entityType.slice(1)) {
    case 'order':
      return hasPermissions(ORDER_DOCUMENT_DOWNLOAD);
    case 'orderItem':
      return hasPermissions(ORDER_ITEMS_DOCUMENT_DOWNLOAD);
    case 'shipment':
      return hasPermissions(SHIPMENT_DOCUMENT_DOWNLOAD);
    case 'productProvider':
      return hasPermissions(PRODUCT_PROVIDER_DOCUMENT_DOWNLOAD);
    case 'project':
      return hasPermissions(MILESTONE_DOCUMENT_DOWNLOAD);
    default:
      return false;
  }
}
export function canViewFile(hasPermissions: Function, fileType: FileType, entityType?: string) {
  switch (fileType) {
    case 'OrderPo':
      return hasPermissions([ORDER_DOCUMENT_GET, ORDER_DOCUMENT_GET_TYPE_PO]);
    case 'OrderPi':
      return hasPermissions([ORDER_DOCUMENT_GET, ORDER_DOCUMENT_GET_TYPE_PI]);
    case 'ShipmentBl':
      return hasPermissions([SHIPMENT_DOCUMENT_GET, SHIPMENT_DOCUMENT_GET_TYPE_BL]);
    case 'ShipmentInvoice':
      return hasPermissions([SHIPMENT_DOCUMENT_GET, SHIPMENT_DOCUMENT_GET_TYPE_INVOICE]);
    case 'ShipmentPackingList':
      return hasPermissions([SHIPMENT_DOCUMENT_GET, SHIPMENT_DOCUMENT_GET_TYPE_PACKING_LIST]);
    case 'ShipmentImportDeclaration':
      return hasPermissions([SHIPMENT_DOCUMENT_GET, SHIPMENT_DOCUMENT_GET_TYPE_IMPORT_DECLARATION]);
    case 'ShipmentInspectionApplication':
      return hasPermissions([
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_APPLICATION,
      ]);
    case 'ShipmentWarehouseArrivalReport':
      return hasPermissions([
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_WAREHOUSE_ARRIVAL_REPORT,
      ]);
    case 'ShipmentWarehouseInspectionReport':
      return hasPermissions([SHIPMENT_DOCUMENT_GET, SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_REPORT]);
    default:
      if (entityType === 'Shipment') {
        return hasPermissions([
          SHIPMENT_DOCUMENT_GET_TYPE_MISCELLANEOUS,
          SHIPMENT_DOCUMENT_SET_MISCELLANEOUS,
        ]);
      }
      return false;
  }
}
export function canViewFileForm(hasPermissions: Function, entityType?: string) {
  if (entityType === undefined) return hasPermissions(PARENTLESS_DOCUMENT_FORM);

  switch (entityType.charAt(0).toLowerCase() + entityType.slice(1)) {
    case 'order':
      return hasPermissions([ORDER_UPDATE, ORDER_DOCUMENT_FORM]);
    case 'orderItem':
      return hasPermissions([ORDER_ITEMS_UPDATE, ORDER_ITEMS_DOCUMENT_FORM]);
    case 'shipment':
      return hasPermissions([SHIPMENT_EDIT, SHIPMENT_DOCUMENT_FORM]);
    case 'productProvider':
      return hasPermissions([PRODUCT_PROVIDER_DOCUMENT_EDIT, PRODUCT_PROVIDER_DOCUMENT_FORM]);
    case 'project':
      return hasPermissions([MILESTONE_DOCUMENT_EDIT, MILESTONE_DOCUMENT_FORM]);
    default:
      return false;
  }
}

export function canUpdateFile(hasPermissions: Function, entityType?: string) {
  if (entityType === undefined) return hasPermissions(PARENTLESS_DOCUMENT_EDIT);

  switch (entityType.charAt(0).toLowerCase() + entityType.slice(1)) {
    case 'order':
      return hasPermissions([ORDER_UPDATE, ORDER_DOCUMENT_EDIT]);
    case 'orderItem':
      return hasPermissions([ORDER_ITEMS_UPDATE, ORDER_ITEMS_DOCUMENT_EDIT]);
    case 'shipment':
      return hasPermissions([SHIPMENT_EDIT, SHIPMENT_DOCUMENT_EDIT]);
    case 'productProvider':
      return hasPermissions([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_DOCUMENT_EDIT]);
    case 'project':
      return hasPermissions([MILESTONE_UPDATE, MILESTONE_DOCUMENT_EDIT]);
    default:
      return false;
  }
}

/**
 * Checks if a user can change the parent of a file.
 */
export function canChangeFileParent(hasPermissions: Function, file: File) {
  switch (file?.entity?.__typename) {
    case 'Order':
      return hasPermissions([ORDER_UPDATE, ORDER_DOCUMENT_EDIT]);
    case 'OrderItem':
      return hasPermissions([ORDER_ITEMS_UPDATE, ORDER_ITEMS_DOCUMENT_EDIT]);
    case 'Shipment':
      return hasPermissions([SHIPMENT_EDIT, SHIPMENT_DOCUMENT_EDIT]);
    case 'Milestone':
      return hasPermissions([MILESTONE_UPDATE, MILESTONE_DOCUMENT_EDIT]);
    case 'ProductProvider':
      return hasPermissions([PRODUCT_PROVIDER_UPDATE, PRODUCT_PROVIDER_DOCUMENT_EDIT]);
    default:
      return hasPermissions(PARENTLESS_DOCUMENT_EDIT);
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

export const downloadFile = (url: string, name: string) => {
  const fileUrl = new URL(url);

  fetch(window.location.origin + fileUrl.pathname)
    .then(resp => resp.blob())
    .then(blob => {
      const newUrl = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.style.display = 'none';
      a.href = newUrl;
      // the filename you want
      a.download = name;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(e => logger.error(e));
};

type DownloadFileParams = Array<{
  url: string,
  name: string,
  blob?: any,
}>;

export const downloadByGroup = (files: DownloadFileParams) => {
  const download = file => {
    const fileUrl = new URL(file.url);

    return fetch(window.location.origin + fileUrl.pathname).then(resp => ({
      ...file,
      blob: resp.blob(),
    }));
  };

  const promises = files.map(file => {
    return download(file);
  });

  return Promise.all(promises);
};

export const exportZip = (data: DownloadFileParams) => {
  const zip = JsZip();
  data.forEach(({ name, blob }) => {
    zip.file(name, blob);
  });

  zip.generateAsync({ type: 'blob' }).then(zipFile => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    const monthString = month < 10 ? `0${month}` : month;
    const dateString = date < 10 ? `0${date}` : date;

    const name = `zenport_${currentDate.getFullYear()}_${monthString}_${dateString}`;
    const fileName = `${name}.zip`; // zenport_2021_09_15.zip

    return FileSaver.saveAs(zipFile, fileName);
  });
};

export const downloadAndZip = (files: DownloadFileParams) => {
  return downloadByGroup(files).then(exportZip);
};

export default canViewFile;
