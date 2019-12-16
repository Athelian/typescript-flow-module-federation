// @flow
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import orderColumns from 'modules/sheet/order/columns';
import productColumns from 'modules/sheet/product/columns';
import orderItemColumns from 'modules/sheet/orderItem/columns';
import batchColumns from 'modules/sheet/batch/columns';
import shipmentColumns from 'modules/sheet/shipment/columns';
import containerColumns from 'modules/sheet/container/columns';

export const FieldDefinitionEntityTypes = ['Order', 'OrderItem', 'Batch', 'Shipment', 'Product'];

export const BatchSheetColumnGroups = ['BATCH', 'ORDER_ITEM', 'ORDER', 'CONTAINER', 'SHIPMENT'];

type Props = {
  orderFieldDefinitions: Array<FieldDefinition>,
  productFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
};

export default function({
  orderFieldDefinitions,
  productFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
}: Props): Array<ColumnConfig> {
  return [
    ...batchColumns(
      {},
      {
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
      batchFieldDefinitions
    ).filter(c => !['batch.action'].includes(c.key)),
    ...orderItemColumns({}, {}, orderItemFieldDefinitions).filter(
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
    ...productColumns({}, {}, productFieldDefinitions),
    ...orderColumns({}, {}, orderFieldDefinitions).filter(
      c =>
        ![
          'order.totalOrdered',
          'order.totalBatched',
          'order.totalShipped',
          'order.totalPrice',
          'order.action',
        ].includes(c.key)
    ),
    ...containerColumns({}, {}).filter(
      c =>
        ![
          'container.totalPrice',
          'container.totalBatchQuantity',
          'container.totalItems',
          'container.totalPackages',
          'container.totalWeight',
          'container.totalVolume',
        ].includes(c.key)
    ),
    ...shipmentColumns(
      {
        'shipment.created': 'shipment.createdAt',
        'shipment.archived': 'shipment.archived',
        'shipment.no': 'shipment.no',
        'shipment.importer': 'shipment.importer',
        'shipment.exporter': 'shipment.exporter',
        'shipment.forwarders': 'shipment.forwarders',
        'shipment.blNo': 'shipment.blNo',
        'shipment.blDate': 'shipment.blDate',
        'shipment.bookingNo': 'shipment.bookingNo',
        'shipment.booked': 'shipment.booked',
        'shipment.bookingDate': 'shipment.bookingDate',
        'shipment.invoiceNo': 'shipment.invoiceNo',
        'shipment.contractNo': 'shipment.contractNo',
        'shipment.transportType': 'shipment.transportType',
        'shipment.loadType': 'shipment.loadType',
        'shipment.incoterm': 'shipment.incoterm',
        'shipment.carrier': 'shipment.carrier',
        'shipment.memo': 'shipment.memo',
        'shipment.inCharges': 'shipment.inCharges',
      },
      {},
      shipmentFieldDefinitions
    ).filter(
      c =>
        ![
          'shipment.relatedExporters',
          'shipment.totalBatchQuantity',
          'shipment.totalPrice',
          'shipment.totalVolume',
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
