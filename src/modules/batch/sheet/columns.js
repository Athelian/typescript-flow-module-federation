// @flow
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import orderColumns from 'modules/sheet/order/columns';
import productColumns from 'modules/sheet/product/columns';
import productProviderColumns from 'modules/sheet/productProvider/columns';
import orderItemColumns from 'modules/sheet/orderItem/columns';
import batchColumns from 'modules/sheet/batch/columns';
import shipmentColumns from 'modules/sheet/shipment/columns';
import containerColumns from 'modules/sheet/container/columns';

export const FieldDefinitionEntityTypes = [
  'Order',
  'OrderItem',
  'Batch',
  'Shipment',
  'Product',
  'ProductProvider',
  'Container',
];

export const BatchSheetColumnGroups = [
  'BATCH',
  'ORDER_ITEM',
  'PRODUCT',
  'PRODUCT_PROVIDER',
  'ORDER',
  'CONTAINER',
  'SHIPMENT',
];

type Props = {|
  orderFieldDefinitions: Array<FieldDefinition>,
  productFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
  containerFieldDefinitions: Array<FieldDefinition>,
|};

export default function({
  orderFieldDefinitions,
  productFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
  containerFieldDefinitions,
}: Props): Array<ColumnConfig> {
  return [
    ...batchColumns({
      sorts: {
        'batch.created': {
          name: 'createdAt',
          group: 'batch',
        },
        'batch.updated': {
          default: true,
          name: 'updatedAt',
          group: 'batch',
        },
        'batch.no': {
          name: 'no',
          group: 'batch',
        },
        'batch.deliveredAt': {
          name: 'deliveredAt',
          group: 'batch',
        },
        'batch.expiredAt': {
          name: 'expiredAt',
          group: 'batch',
        },
        'batch.producedAt': {
          name: 'producedAt',
          group: 'batch',
        },
        'batch.desiredAt': {
          name: 'desiredAt',
          group: 'batch',
        },
      },
      fieldDefinitions: batchFieldDefinitions,
    }).filter(c => !['batch.action'].includes(c.key)),
    ...orderItemColumns({
      fieldDefinitions: orderItemFieldDefinitions,
    }).filter(
      c =>
        ![
          'orderItem.remainQuantity',
          'orderItem.totalBatched',
          'orderItem.remainingBatchedQuantity',
          'orderItem.totalShipped',
          'orderItem.remainingShippedQuantity',
          'orderItem.totalPrice',
          'orderItem.action',
        ].includes(c.key)
    ),
    ...productColumns({
      sorts: {
        'product.name': {
          name: 'productName',
          group: 'batch',
        },
        'product.serial': {
          name: 'productSerial',
          group: 'batch',
        },
      },
      fieldDefinitions: productFieldDefinitions,
    }),
    ...productProviderColumns({}),
    ...orderColumns({
      sorts: {
        'order.poNo': {
          name: 'poNo',
          group: 'batch',
        },
        'order.exporter': {
          name: 'orderExporter',
          group: 'batch',
        },
      },
      fieldDefinitions: orderFieldDefinitions,
    }).filter(
      c =>
        ![
          'order.totalOrdered',
          'order.totalBatched',
          'order.totalShipped',
          'order.totalPrice',
          'order.totalVolume',
          'order.action',
        ].includes(c.key)
    ),
    ...containerColumns({
      fieldDefinitions: containerFieldDefinitions,
      sorts: {
        'container.dueDate': {
          name: 'containerFreeTimeDueDate',
          group: 'batch',
        },
        'container.warehouseArrivalAgreedDate': {
          name: 'containerWarehouseAgreedArrivalDate',
          group: 'batch',
        },
      },
    }).filter(
      c =>
        ![
          'container.totalPrice',
          'container.totalBatchQuantity',
          'container.totalItems',
          'container.totalPackages',
          'container.totalWeight',
          'container.totalVolume',
          'container.loadingRate',
        ].includes(c.key)
    ),
    ...shipmentColumns({
      fieldDefinitions: shipmentFieldDefinitions,
      sorts: {
        'shipment.no': {
          name: 'shipmentNo',
          group: 'batch',
        },
        'shipment.voyage.0.departurePort': {
          name: 'shipmentLoadPort',
          group: 'batch',
        },
        'shipment.voyage.0.departure.latestDate': {
          name: 'shipmentLoadPortDeparture',
          group: 'batch',
        },
        'shipment.voyage.2.arrivalPort': {
          name: 'shipmentDischargePort',
          group: 'batch',
        },
        'shipment.voyage.2.arrival.latestDate': {
          name: 'shipmentDischargePortArrival',
          group: 'batch',
        },
      },
    }).filter(
      c =>
        ![
          'shipment.relatedExporters',
          'shipment.totalBatchQuantity',
          'shipment.totalPrice',
          'shipment.totalWeight',
          'shipment.totalPackages',
          'shipment.totalProducts',
          'shipment.totalOrders',
          'shipment.totalBatches',
          'shipment.totalContainers',
        ].includes(c.key)
    ),
  ];
}
