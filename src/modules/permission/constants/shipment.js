export const SHIPMENT_LIST = 'shipment.shipments.list';
export const SHIPMENT_GET = 'shipment.shipments.get';
export const SHIPMENT_CREATE = 'shipment.shipments.create';
export const SHIPMENT_UPDATE = 'shipment.shipments.update';
export const SHIPMENT_DOWNLOAD_DOCUMENTS = 'shipment.shipments.downloadDocuments';

const shipment = {
  default: [SHIPMENT_LIST, SHIPMENT_GET, SHIPMENT_DOWNLOAD_DOCUMENTS],
  weinhaus: [],
  manager: [
    SHIPMENT_LIST,
    SHIPMENT_GET,
    SHIPMENT_CREATE,
    SHIPMENT_UPDATE,
    SHIPMENT_DOWNLOAD_DOCUMENTS,
  ],
};

export default shipment;
