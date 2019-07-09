// @flow
import { type IntlShape } from 'react-intl';
import orderMessages from 'modules/order/messages';
import batchMessages from 'modules/batch/messages';
import shipmentMessages from 'modules/shipment/messages';

export const START_DATE = 'TaskStartDate';
export const DUE_DATE = 'TaskDueDate';
export const PROJECT_DUE_DATE = 'ProjectDueDate';
export const MILESTONE_DUE_DATE = 'MilestoneDueDate';
const ORDER_ISSUED_AT = 'OrderIssuedAt';
const ORDER_DELIVERY_DATE = 'OrderDeliveryDate';
const ORDER_ITEM_ISSUED_AT = 'OrderItemOrderIssuedAt';
const ORDER_ITEM_DELIVERY_DATE = 'OrderItemOrderDeliveryDate';
const BATCH_DELIVERED_AT = 'BatchDeliveredAt';
const BATCH_DESIRED_AT = 'BatchDesiredAt';
const BATCH_PRODUCED_AT = 'BatchProducedAt';
const BATCH_EXPIRED_AT = 'BatchExpiredAt';
const SHIPMENT_BL_DATE = 'ShipmentBlDate';
const SHIPMENT_BOOKING_DATE = 'ShipmentBookingDate';
const SHIPMENT_CARGO_READY = 'ShipmentCargoReady';
const SHIPMENT_LOAD_PORT_DEPARTURE = 'ShipmentLoadPortDeparture';
const SHIPMENT_FIRST_TRANSIT_PORT_ARRIVAL = 'ShipmentFirstTransitPortArrival';
const SHIPMENT_FIRST_TRANSIT_PORT_DEPARTURE = 'ShipmentFirstTransitPortDeparture';
const SHIPMENT_SECOND_TRANSIT_PORT_ARRIVAL = 'ShipmentSecondTransitPortArrival';
const SHIPMENT_SECOND_TRANSIT_PORT_DEPARTURE = 'ShipmentSecondTransitPortDeparture';
const SHIPMENT_DISCHARGE_PORT_ARRIVAL = 'ShipmentDischargePortArrival';
const SHIPMENT_CUSTOM_CLEARANCE = 'ShipmentCustomClearance';
const SHIPMENT_WAREHOUSE_ARRIVAL = 'ShipmentWarehouseArrival';
const SHIPMENT_DELIVERY_READY = 'ShipmentDeliveryReady';

export const orderBinding = (intl: IntlShape) => ({
  issuedAt: {
    field: ORDER_ISSUED_AT,
    description: intl.formatMessage(orderMessages.date),
  },
  deliveryDate: {
    field: ORDER_DELIVERY_DATE,
    description: intl.formatMessage(orderMessages.deliveryDate),
  },
});

export const orderItemBinding = (intl: IntlShape) => ({
  issuedAt: {
    field: ORDER_ITEM_ISSUED_AT,
    description: intl.formatMessage(orderMessages.date),
  },
  deliveryDate: {
    field: ORDER_ITEM_DELIVERY_DATE,
    description: intl.formatMessage(orderMessages.deliveryDate),
  },
});

export const batchBinding = (intl: IntlShape) => ({
  deliveredAt: {
    field: BATCH_DELIVERED_AT,
    description: intl.formatMessage(batchMessages.deliveredAt),
  },
  desiredAt: {
    field: BATCH_DESIRED_AT,
    description: intl.formatMessage(batchMessages.desiredAt),
  },
  producedAt: {
    field: BATCH_PRODUCED_AT,
    description: intl.formatMessage(batchMessages.producedAt),
  },
  expiredAt: {
    field: BATCH_EXPIRED_AT,
    description: intl.formatMessage(batchMessages.expiredAt),
  },
});

export const shipmentBinding = (intl: IntlShape) => ({
  blDate: {
    field: SHIPMENT_BL_DATE,
    description: intl.formatMessage(shipmentMessages.blDate),
  },
  bookingDate: {
    field: SHIPMENT_BOOKING_DATE,
    description: intl.formatMessage(shipmentMessages.bookingDate),
  },
  cargoReady: {
    field: SHIPMENT_CARGO_READY,
    description: intl.formatMessage(shipmentMessages.cargoReady),
  },
  loadPortDeparture: {
    field: SHIPMENT_LOAD_PORT_DEPARTURE,
    description: intl.formatMessage(shipmentMessages.loadPortDeparture),
  },
  firstTransitPortArrival: {
    field: SHIPMENT_FIRST_TRANSIT_PORT_ARRIVAL,
    description: intl.formatMessage(shipmentMessages.firstTransitPortArrival),
  },
  firstTransitPortDeparture: {
    field: SHIPMENT_FIRST_TRANSIT_PORT_DEPARTURE,
    description: intl.formatMessage(shipmentMessages.firstTransitPortDeparture),
  },
  secondTransitPortArrival: {
    field: SHIPMENT_SECOND_TRANSIT_PORT_ARRIVAL,
    description: intl.formatMessage(shipmentMessages.secondTransitPortArrival),
  },
  secondTransitPortDeparture: {
    field: SHIPMENT_SECOND_TRANSIT_PORT_DEPARTURE,
    description: intl.formatMessage(shipmentMessages.secondTransitPortDeparture),
  },
  dischargePortArrival: {
    field: SHIPMENT_DISCHARGE_PORT_ARRIVAL,
    description: intl.formatMessage(shipmentMessages.dischargePortArrival),
  },
  customClearance: {
    field: SHIPMENT_CUSTOM_CLEARANCE,
    description: intl.formatMessage(shipmentMessages.customClearance),
  },
  deliveryReady: {
    field: SHIPMENT_DELIVERY_READY,
    description: intl.formatMessage(shipmentMessages.deliveryReady),
  },
  warehouseArrival: {
    field: SHIPMENT_WAREHOUSE_ARRIVAL,
    description: intl.formatMessage(shipmentMessages.warehouseArrival),
  },
});
