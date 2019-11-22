// @flow
import { defaultVolumeMetric } from 'utils/metric';
import productMessages from 'modules/product/messages';
import orderMessages from 'modules/order/messages';
import orderItemMessages from 'modules/orderItem/messages';
import batchMessages from 'modules/batch/messages';
import shipmentMessages from 'modules/shipment/messages';
import containerMessages from 'modules/container/messages';
import warehouseMessages from 'modules/warehouse/messages';
import partnerMessages from 'modules/partner/messages';
import userMessages from 'modules/staff/messages';
import fileMessages from 'modules/document/messages';
import projectMessages from 'modules/project/messages';
import taskMessages from 'modules/task/messages';
import tagMessages from 'modules/tags/messages';
import tableTemplateMessages from 'modules/tableTemplate/messages';
import type { FilterConfig } from './types';

export const ProductFilterConfig: Array<FilterConfig> = [
  {
    entity: 'PRODUCT',
    field: 'archived',
    type: 'archived',
    message: productMessages.status,
    defaultValue: false,
  },
  {
    entity: 'PRODUCT',
    field: 'createdAt',
    type: 'date_range',
    message: productMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'PRODUCT',
    field: 'updatedAt',
    type: 'date_range',
    message: productMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'PRODUCT',
    field: 'tagIds',
    type: 'product_tags',
    message: productMessages.tags,
    defaultValue: [],
  },
];

export const ProductProviderFilterConfig: Array<FilterConfig> = [
  {
    entity: 'END PRODUCT',
    field: 'archived',
    type: 'archived',
    message: productMessages.status,
    defaultValue: false,
  },
  {
    entity: 'END PRODUCT',
    field: 'createdAt',
    type: 'date_range',
    message: productMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'END PRODUCT',
    field: 'updatedAt',
    type: 'date_range',
    message: productMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'END PRODUCT',
    field: 'tagIds',
    type: 'product_tags',
    message: productMessages.tags,
    defaultValue: [],
  },
  {
    entity: 'END PRODUCT',
    field: 'importerId',
    type: 'importer_id',
    message: productMessages.importer,
    defaultValue: null,
    hidden: true,
  },
  {
    entity: 'END PRODUCT',
    field: 'exporterId',
    type: 'exporter_id',
    message: productMessages.exporter,
    defaultValue: null,
    hidden: true,
  },
  {
    entity: 'END PRODUCT',
    field: 'supplierId',
    type: 'supplier_id',
    message: productMessages.supplier,
    defaultValue: null,
    hidden: true,
  },
];

export const OrderFilterConfig: Array<FilterConfig> = [
  {
    entity: 'ORDER',
    field: 'archived',
    type: 'archived',
    message: orderMessages.status,
    defaultValue: false,
  },
  {
    entity: 'ORDER',
    field: 'createdAt',
    type: 'date_range',
    message: orderMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'ORDER',
    field: 'updatedAt',
    type: 'date_range',
    message: orderMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'ORDER',
    field: 'inChargeIds',
    type: 'users',
    message: orderMessages.inCharge,
    defaultValue: [],
  },
  {
    entity: 'ORDER',
    field: 'exporterIds',
    type: 'exporter_ids',
    message: orderMessages.exporter,
    defaultValue: [],
  },
  {
    entity: 'ORDER',
    field: 'tagIds',
    type: 'order_tags',
    message: orderMessages.tags,
    defaultValue: [],
  },
  {
    entity: 'ORDER',
    field: 'ids',
    type: 'order_ids',
    message: orderMessages.order,
    defaultValue: [],
    hidden: true,
  },
  {
    entity: 'ORDER',
    field: 'completelyBatched',
    type: 'completely_batched',
    message: orderMessages.completelyBatched,
    defaultValue: false,
  },
  {
    entity: 'ORDER',
    field: 'completelyShipped',
    type: 'completely_shipped',
    message: orderMessages.completelyShipped,
    defaultValue: false,
  },
  {
    entity: 'BATCH',
    field: 'batchDeliveredAt',
    type: 'date_range',
    message: batchMessages.deliveredAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'batchExpiredAt',
    type: 'date_range',
    message: batchMessages.expiredAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'batchProducedAt',
    type: 'date_range',
    message: batchMessages.producedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'batchTotalVolume',
    type: 'volume_range',
    message: batchMessages.totalVolume,
    defaultValue: {
      min: null,
      max: null,
      metric: defaultVolumeMetric,
    },
  },
  {
    entity: 'BATCH',
    field: 'batchTagIds',
    type: 'batch_tags',
    message: batchMessages.tags,
    defaultValue: [],
  },
  {
    entity: 'PRODUCT',
    field: 'productIds',
    type: 'product_ids',
    message: productMessages.product,
    defaultValue: [],
  },
  {
    entity: 'PRODUCT',
    field: 'productTagIds',
    type: 'product_tags',
    message: productMessages.tags,
    defaultValue: [],
  },
  {
    entity: 'END PRODUCT',
    field: 'productProviderIds',
    type: 'product_provider_ids',
    message: productMessages.productProvider,
    defaultValue: [],
  },
  {
    entity: 'END PRODUCT',
    field: 'supplierIds',
    type: 'supplier_ids',
    message: productMessages.supplier,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentArchived',
    type: 'archived',
    message: shipmentMessages.status,
    defaultValue: false,
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentForwarderIds',
    type: 'forwarder_ids',
    message: shipmentMessages.forwarder,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentInChargeIds',
    type: 'users',
    message: shipmentMessages.inCharge,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentWarehouseIds',
    type: 'warehouse_ids',
    message: shipmentMessages.warehouse,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentCargoReady',
    type: 'date_range',
    message: shipmentMessages.cargoReady,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentLoadPortDeparture',
    type: 'date_range',
    message: shipmentMessages.loadPortDeparture,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentLoadPorts',
    type: 'ports',
    message: shipmentMessages.loadPort,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentFirstTransitPortArrival',
    type: 'date_range',
    message: shipmentMessages.firstTransitPortArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentFirstTransitPortDeparture',
    type: 'date_range',
    message: shipmentMessages.firstTransitPortDeparture,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentFirstTransitPorts',
    type: 'ports',
    message: shipmentMessages.firstTransitPort,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentSecondTransitPortArrival',
    type: 'date_range',
    message: shipmentMessages.secondTransitPortArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentSecondTransitPortDeparture',
    type: 'date_range',
    message: shipmentMessages.secondTransitPortDeparture,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentSecondTransitPorts',
    type: 'ports',
    message: shipmentMessages.secondTransitPort,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentDischargePortArrival',
    type: 'date_range',
    message: shipmentMessages.dischargePortArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentDischargePorts',
    type: 'ports',
    message: shipmentMessages.dischargePort,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentCustomClearance',
    type: 'date_range',
    message: shipmentMessages.customClearance,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentWarehouseArrival',
    type: 'date_range',
    message: shipmentMessages.warehouseArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentDeliveryReady',
    type: 'date_range',
    message: shipmentMessages.deliveryReady,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentCreatedAt',
    type: 'date_range',
    message: shipmentMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentUpdatedAt',
    type: 'date_range',
    message: shipmentMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'shipmentTagIds',
    type: 'shipment_tags',
    message: shipmentMessages.tags,
    defaultValue: [],
  },
  {
    entity: 'CONTAINER',
    field: 'containerContainerType',
    type: 'container_type',
    message: containerMessages.containerType,
    defaultValue: null,
  },
  {
    entity: 'CONTAINER',
    field: 'containerContainerOption',
    type: 'container_option',
    message: containerMessages.containerOption,
    defaultValue: null,
  },
  {
    entity: 'CONTAINER',
    field: 'containerWarehouseIds',
    type: 'warehouse_ids',
    message: containerMessages.warehouse,
    defaultValue: [],
  },
  {
    entity: 'CONTAINER',
    field: 'containerTagIds',
    type: 'container_tags',
    message: containerMessages.tags,
    defaultValue: [],
  },
  {
    entity: 'CONTAINER',
    field: 'containerCreatedAt',
    type: 'date_range',
    message: containerMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'CONTAINER',
    field: 'containerUpdatedAt',
    type: 'date_range',
    message: containerMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'CONTAINER',
    field: 'containerWarehouseArrivalAgreedDate',
    type: 'date_range',
    message: containerMessages.warehouseArrivalAgreedDate,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'CONTAINER',
    field: 'containerWarehouseArrivalActualDate',
    type: 'date_range',
    message: containerMessages.warehouseArrivalActualDate,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'CONTAINER',
    field: 'containerFreeTimeDueDate',
    type: 'date_range',
    message: containerMessages.dueDate,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'CONTAINER',
    field: 'containerFreeTimeOverdue',
    type: 'free_time_overdue',
    message: containerMessages.freeTimeOverdue,
    defaultValue: false,
  },
];

export const OrderItemFilterConfig: Array<FilterConfig> = [
  {
    entity: 'ORDER ITEM',
    field: 'archived',
    type: 'archived',
    message: orderItemMessages.status,
    defaultValue: false,
  },
  {
    entity: 'ORDER ITEM',
    field: 'createdAt',
    type: 'date_range',
    message: orderItemMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'ORDER ITEM',
    field: 'updatedAt',
    type: 'date_range',
    message: orderItemMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
];

export const BatchFilterConfig: Array<FilterConfig> = [
  {
    entity: 'BATCH',
    field: 'archived',
    type: 'archived',
    message: batchMessages.status,
    defaultValue: false,
  },
  {
    entity: 'BATCH',
    field: 'deliveredAt',
    type: 'date_range',
    message: batchMessages.deliveredAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'expiredAt',
    type: 'date_range',
    message: batchMessages.expiredAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'producedAt',
    type: 'date_range',
    message: batchMessages.producedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'tagIds',
    type: 'batch_tags',
    message: batchMessages.tags,
    defaultValue: [],
  },
  {
    entity: 'BATCH',
    field: 'importerId',
    type: 'importer_id',
    message: batchMessages.importer,
    defaultValue: null,
    hidden: true,
  },
  {
    entity: 'BATCH',
    field: 'exporterId',
    type: 'exporter_id',
    message: batchMessages.exporter,
    defaultValue: null,
    hidden: true,
  },
  {
    entity: 'BATCH',
    field: 'hasShipment',
    type: 'has_shipment',
    message: batchMessages.hasShipment,
    defaultValue: [],
  },
  {
    entity: 'BATCH',
    field: 'createdAt',
    type: 'date_range',
    message: batchMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'BATCH',
    field: 'updatedAt',
    type: 'date_range',
    message: batchMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
];

export const ShipmentFilterConfig: Array<FilterConfig> = [
  {
    entity: 'SHIPMENT',
    field: 'ids',
    type: 'shipment_ids',
    message: shipmentMessages.shipment,
    defaultValue: [],
    hidden: true,
  },
  {
    entity: 'SHIPMENT',
    field: 'archived',
    type: 'archived',
    message: shipmentMessages.status,
    defaultValue: false,
  },
  {
    entity: 'SHIPMENT',
    field: 'forwarderIds',
    type: 'forwarder_ids',
    message: shipmentMessages.forwarder,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'inChargeIds',
    type: 'users',
    message: shipmentMessages.inCharge,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'warehouseIds',
    type: 'warehouse_ids',
    message: shipmentMessages.warehouse,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'cargoReady',
    type: 'date_range',
    message: shipmentMessages.cargoReady,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'loadPortDeparture',
    type: 'date_range',
    message: shipmentMessages.loadPortDeparture,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'loadPorts',
    type: 'ports',
    message: shipmentMessages.loadPort,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'firstTransitPortArrival',
    type: 'date_range',
    message: shipmentMessages.firstTransitPortArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'firstTransitPortDeparture',
    type: 'date_range',
    message: shipmentMessages.firstTransitPortDeparture,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'firstTransitPorts',
    type: 'ports',
    message: shipmentMessages.firstTransitPort,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'secondTransitPortArrival',
    type: 'date_range',
    message: shipmentMessages.secondTransitPortArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'secondTransitPortDeparture',
    type: 'date_range',
    message: shipmentMessages.secondTransitPortDeparture,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'secondTransitPorts',
    type: 'ports',
    message: shipmentMessages.secondTransitPort,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'dischargePortArrival',
    type: 'date_range',
    message: shipmentMessages.dischargePortArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'dischargePorts',
    type: 'ports',
    message: shipmentMessages.dischargePort,
    defaultValue: [],
  },
  {
    entity: 'SHIPMENT',
    field: 'customClearance',
    type: 'date_range',
    message: shipmentMessages.customClearance,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'warehouseArrival',
    type: 'date_range',
    message: shipmentMessages.warehouseArrival,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'deliveryReady',
    type: 'date_range',
    message: shipmentMessages.deliveryReady,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'createdAt',
    type: 'date_range',
    message: shipmentMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'updatedAt',
    type: 'date_range',
    message: shipmentMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'SHIPMENT',
    field: 'tagIds',
    type: 'shipment_tags',
    message: shipmentMessages.tags,
    defaultValue: [],
  },
];

export const ContainerFilterConfig: Array<FilterConfig> = [
  {
    entity: 'CONTAINER',
    field: 'archived',
    type: 'archived',
    message: containerMessages.status,
    defaultValue: false,
  },
  {
    entity: 'CONTAINER',
    field: 'warehouseArrivalActualDate',
    type: 'date_range',
    message: containerMessages.warehouseArrivalActualDate,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'CONTAINER',
    field: 'warehouseIds',
    type: 'warehouse_ids',
    message: containerMessages.warehouse,
    defaultValue: [],
  },
  {
    entity: 'CONTAINER',
    field: 'createdAt',
    type: 'date_range',
    message: containerMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'CONTAINER',
    field: 'updatedAt',
    type: 'date_range',
    message: containerMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
];

export const WarehouseFilterConfig: Array<FilterConfig> = [
  {
    entity: 'WAREHOUSE',
    field: 'archived',
    type: 'archived',
    message: warehouseMessages.status,
    defaultValue: false,
  },
  {
    entity: 'WAREHOUSE',
    field: 'createdAt',
    type: 'date_range',
    message: warehouseMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'WAREHOUSE',
    field: 'updatedAt',
    type: 'date_range',
    message: warehouseMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
];

export const PartnerFilterConfig: Array<FilterConfig> = [
  {
    entity: 'PARTNER',
    field: 'createdAt',
    type: 'date_range',
    message: partnerMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'PARTNER',
    field: 'updatedAt',
    type: 'date_range',
    message: partnerMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'PARTNER',
    field: 'types',
    type: 'organization_types',
    message: partnerMessages.type,
    defaultValue: [],
  },
];

export const UserFilterConfig: Array<FilterConfig> = [
  {
    entity: 'USER',
    field: 'createdAt',
    type: 'date_range',
    message: userMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'USER',
    field: 'updatedAt',
    type: 'date_range',
    message: userMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'USER',
    field: 'organizationIds',
    type: 'organization_ids',
    message: userMessages.organizations,
    defaultValue: [],
  },
];

export const FileFilterConfig: Array<FilterConfig> = [
  {
    entity: 'DOCUMENT',
    field: 'createdAt',
    type: 'date_range',
    message: fileMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'DOCUMENT',
    field: 'updatedAt',
    type: 'date_range',
    message: fileMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
];

export const ProjectFilterConfig: Array<FilterConfig> = [
  {
    entity: 'PROJECT',
    field: 'createdAt',
    type: 'date_range',
    message: projectMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'PROJECT',
    field: 'updatedAt',
    type: 'date_range',
    message: projectMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'PROJECT',
    field: 'dueDate',
    type: 'date_range',
    message: projectMessages.dueDate,
    defaultValue: { after: null, before: null },
  },
];

export const TaskFilterConfig: Array<FilterConfig> = [
  {
    entity: 'TASK',
    field: 'createdAt',
    type: 'date_range',
    message: taskMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'TASK',
    field: 'updatedAt',
    type: 'date_range',
    message: taskMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'TASK',
    field: 'startDate',
    type: 'date_range',
    message: taskMessages.startDate,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'TASK',
    field: 'dueDate',
    type: 'date_range',
    message: taskMessages.dueDate,
    defaultValue: { after: null, before: null },
  },
];

export const TaskTemplateFilterConfig: Array<FilterConfig> = [
  {
    entity: 'TASK TEMPLATE',
    field: 'createdAt',
    type: 'date_range',
    message: taskMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'TASK TEMPLATE',
    field: 'updatedAt',
    type: 'date_range',
    message: taskMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'TASK TEMPLATE',
    field: 'entityTypes',
    type: 'task_template_entity_types',
    message: taskMessages.entity,
    defaultValue: [],
  },
];

export const TagFilterConfig: Array<FilterConfig> = [
  {
    entity: 'TAG',
    field: 'createdAt',
    type: 'date_range',
    message: tagMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'TAG',
    field: 'updatedAt',
    type: 'date_range',
    message: tagMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
];

export const MaskEditFilterConfig: Array<FilterConfig> = [
  {
    entity: 'TABLE TEMPLATE',
    field: 'createdAt',
    type: 'date_range',
    message: tableTemplateMessages.createdAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'TABLE TEMPLATE',
    field: 'updatedAt',
    type: 'date_range',
    message: tableTemplateMessages.updatedAt,
    defaultValue: { after: null, before: null },
  },
  {
    entity: 'TABLE TEMPLATE',
    field: 'type',
    type: 'mask_edit_type',
    message: tableTemplateMessages.type,
    defaultValue: [],
  },
];
