const SHIPMENT_LIST = 'shipment.shipments.list';
const SHIPMENT_GET = 'shipment.shipments.get';
const SHIPMENT_CREATE = 'shipment.shipments.create';
const SHIPMENT_UPDATE = 'shipment.shipments.update';

const shipment = {
  default: [SHIPMENT_LIST, SHIPMENT_GET],
  manager: [SHIPMENT_LIST, SHIPMENT_GET, SHIPMENT_CREATE, SHIPMENT_UPDATE],
};

export default shipment;
