// @flow
import { defaultVolumeMetric } from 'utils/metric';
import type { FilterConfig } from './index';

export const OrderConfigFilter: Array<FilterConfig> = [
  { entity: 'ORDER', field: 'archived', type: 'archived', defaultValue: false },
  {
    entity: 'ORDER',
    field: 'createdAt',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'ORDER',
    field: 'updatedAt',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'batchDeliveredAt',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'batchExpiredAt',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'batchProducedAt',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'batchTotalVolume',
    type: 'volume_range',
    defaultValue: {
      min: null,
      max: null,
      metric: defaultVolumeMetric,
    },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentArchived',
    type: 'archived',
    defaultValue: false,
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentCargoReady',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentLoadPortDeparture',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentFirstTransitPortArrival',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentFirstTransitPortDeparture',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentSecondTransitPortArrival',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentSecondTransitPortDeparture',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentDischargePortArrival',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentCustomClearance',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentWarehouseArrival',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentDeliveryReady',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentCreatedAt',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentUpdatedAt',
    type: 'date_range',
    defaultValue: { after: null, before: null },
  },
];
