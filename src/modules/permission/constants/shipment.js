export const SHIPMENT_LIST = 'shipment.shipments.list';
export const SHIPMENT_GET = 'shipment.shipments.get';
export const SHIPMENT_CREATE = 'shipment.shipments.create';
export const SHIPMENT_UPDATE = 'shipment.shipments.update';

const shipment = {
  default: [SHIPMENT_LIST, SHIPMENT_GET],
  manager: [SHIPMENT_LIST, SHIPMENT_GET, SHIPMENT_CREATE, SHIPMENT_UPDATE],
};

export default shipment;
