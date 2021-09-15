// @flow
import type { FileType, File } from 'generated/graphql';
import logger from 'utils/logger';
import {
  ORDER_DOCUMENT_GET,
  ORDER_DOCUMENT_GET_TYPE_PO,
  ORDER_DOCUMENT_GET_TYPE_PI,
  ORDER_DOCUMENT_CREATE,
  ORDER_DOCUMENT_DELETE,
  ORDER_SET_DOCUMENTS,
  ORDER_DOWNLOAD_DOCUMENTS,
  ORDER_UPDATE,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_DOCUMENT_CREATE,
  ORDER_ITEMS_DOCUMENT_DELETE,
  ORDER_ITEMS_SET_DOCUMENTS,
  ORDER_ITEMS_DOWNLOAD_DOCUMENTS,
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
  SHIPMENT_DOCUMENT_CREATE,
  SHIPMENT_DOCUMENT_DELETE,
  SHIPMENT_DOCUMENT_SET,
  SHIPMENT_DOCUMENT_DOWNLOAD,
  SHIPMENT_SET,
  SHIPMENT_UPDATE,
} from 'modules/permission/constants/shipment';
import {
  MILESTONE_UPDATE,
  MILESTONE_DOCUMENT_CREATE,
  MILESTONE_DOCUMENT_DELETE,
  MILESTONE_SET_DOCUMENTS,
  MILESTONE_DOWNLOAD_DOCUMENTS,
} from 'modules/permission/constants/milestone';
import {
  PRODUCT_DOCUMENT_GET,
  PRODUCT_DOCUMENT_GET_TYPE_SPECIFICATION,
  PRODUCT_DOCUMENT_GET_TYPE_ANALYSIS_CERTIFICATE,
  PRODUCT_DOCUMENT_GET_TYPE_ORIGIN_CERTIFICATE,
  PRODUCT_SET_DOCUMENTS,
  PRODUCT_DOWNLOAD_DOCUMENTS,
  PRODUCT_DOCUMENT_CREATE,
  PRODUCT_DOCUMENT_DELETE,
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_DOCUMENT_CREATE,
  PRODUCT_PROVIDER_DOCUMENT_DELETE,
  PRODUCT_PROVIDER_SET_DOCUMENTS,
  PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS,
} from 'modules/permission/constants/product';

import {
  DOCUMENT_SET,
  DOCUMENT_DOWNLOAD,
  DOCUMENT_GET,
  DOCUMENT_UPDATE,
} from 'modules/permission/constants/file';
import JsZip from 'jszip';
import FileSaver from 'file-saver';

export function canDownloadFile(hasPermissions: Function, entityType?: string) {
  switch (entityType) {
    case 'order':
      return hasPermissions([DOCUMENT_SET, DOCUMENT_DOWNLOAD, ORDER_DOWNLOAD_DOCUMENTS]);
    case 'orderItem':
      return hasPermissions([DOCUMENT_SET, DOCUMENT_DOWNLOAD, ORDER_ITEMS_DOWNLOAD_DOCUMENTS]);
    case 'shipment':
      return hasPermissions([DOCUMENT_SET, DOCUMENT_DOWNLOAD, SHIPMENT_DOCUMENT_DOWNLOAD]);
    case 'product':
      return hasPermissions([DOCUMENT_SET, DOCUMENT_DOWNLOAD, PRODUCT_DOWNLOAD_DOCUMENTS]);
    case 'productProvider':
      return hasPermissions([DOCUMENT_SET, DOCUMENT_DOWNLOAD, PRODUCT_PROVIDER_DOWNLOAD_DOCUMENTS]);
    case 'project':
      return hasPermissions([DOCUMENT_SET, DOCUMENT_DOWNLOAD, MILESTONE_DOWNLOAD_DOCUMENTS]);
    default:
      return hasPermissions([DOCUMENT_SET, DOCUMENT_DOWNLOAD]);
  }
}
export function canViewFile(hasPermissions: Function, type: FileType, entityType?: string) {
  switch (type) {
    case 'OrderPo':
      return hasPermissions([DOCUMENT_GET, ORDER_DOCUMENT_GET, ORDER_DOCUMENT_GET_TYPE_PO]);
    case 'OrderPi':
      return hasPermissions([DOCUMENT_GET, ORDER_DOCUMENT_GET, ORDER_DOCUMENT_GET_TYPE_PI]);
    case 'ShipmentBl':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_BL,
        SHIPMENT_DOCUMENT_SET,
      ]);
    case 'ShipmentInvoice':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_SET,
        SHIPMENT_DOCUMENT_GET_TYPE_INVOICE,
      ]);
    case 'ShipmentPackingList':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_SET,
        SHIPMENT_DOCUMENT_GET_TYPE_PACKING_LIST,
      ]);
    case 'ShipmentImportDeclaration':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_SET,
        SHIPMENT_DOCUMENT_GET_TYPE_IMPORT_DECLARATION,
      ]);
    case 'ShipmentInspectionApplication':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_SET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_INSPECTION_APPLICATION,
      ]);
    case 'ShipmentWarehouseArrivalReport':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_SET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET_TYPE_WAREHOUSE_ARRIVAL_REPORT,
      ]);
    case 'ShipmentWarehouseInspectionReport':
      return hasPermissions([
        DOCUMENT_GET,
        SHIPMENT_DOCUMENT_GET,
        SHIPMENT_DOCUMENT_SET,
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
      if (entityType === 'Shipment') {
        return hasPermissions([
          DOCUMENT_GET,
          SHIPMENT_DOCUMENT_SET,
          SHIPMENT_DOCUMENT_GET_TYPE_MISCELLANEOUS,
          SHIPMENT_DOCUMENT_SET_MISCELLANEOUS,
        ]);
      }
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

export const downloadFile = (url: string, name: string) => {
  fetch(url)
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
    return fetch(file.url).then(resp => ({
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
