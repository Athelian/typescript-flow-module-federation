// @flow
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import orderColumns from 'modules/sheet/order/columns';
import orderItemColumns from 'modules/sheet/orderItem/columns';
import shipmentColumns from 'modules/sheet/shipment/columns';
import containerColumns from 'modules/sheet/container/columns';
import batchColumns from 'modules/sheet/batch/columns';
import productColumns from 'modules/sheet/product/columns';
import productProviderColumns from 'modules/sheet/productProvider/columns';

export const FieldDefinitionEntityTypes = [
  'Order',
  'OrderItem',
  'Batch',
  'Shipment',
  'Product',
  'ProductProvider',
  'Container',
];

export const ShipmentSheetColumnGroups = [
  'SHIPMENT',
  'CONTAINER',
  'BATCH',
  'ORDER_ITEM',
  'PRODUCT',
  'PRODUCT_PROVIDER',
  'ORDER',
];

type Props = {|
  orderFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
  productFieldDefinitions: Array<FieldDefinition>,
  containerFieldDefinitions: Array<FieldDefinition>,
|};

export default function({
  orderFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
  productFieldDefinitions,
  containerFieldDefinitions,
}: Props): Array<ColumnConfig> {
  return [
    ...shipmentColumns({
      sorts: {
        'shipment.created': {
          name: 'createdAt',
          group: 'shipment',
        },
        'shipment.updated': {
          name: 'updatedAt',
          group: 'shipment',
        },
        'shipment.no': {
          name: 'no',
          group: 'shipment',
        },
        'shipment.blNo': {
          name: 'blNo',
          group: 'shipment',
        },
        'shipment.cargoReady.date': {
          name: 'cargoReady',
          group: 'shipment',
        },
        'shipment.voyage.0.departurePort': {
          name: 'loadPort',
          group: 'shipment',
        },
        'shipment.voyage.0.departure.date': {
          name: 'loadPortDeparture',
          group: 'shipment',
        },
        'shipment.voyage.0.firstTransitArrival.date': {
          name: 'firstTransitPortArrival',
          group: 'shipment',
        },
        'shipment.voyage.1.firstTransitDeparture.date': {
          name: 'firstTransitPortDeparture',
          group: 'shipment',
        },
        'shipment.voyage.1.secondTransitArrival.date': {
          name: 'secondTransitPortArrival',
          group: 'shipment',
        },
        'shipment.voyage.2.secondTransitDeparture.date': {
          name: 'secondTransitPortDeparture',
          group: 'shipment',
        },
        'shipment.voyage.2.arrivalPort': {
          name: 'dischargePort',
          group: 'shipment',
        },
        'shipment.voyage.2.arrival.date': {
          name: 'dischargePortArrival',
          group: 'shipment',
        },
        'shipment.containerGroup.customClearance.date': {
          name: 'customClearance',
          group: 'shipment',
        },
        'shipment.containerGroup.warehouseArrival.date': {
          name: 'warehouseArrival',
          group: 'shipment',
        },
        'shipment.containerGroup.deliveryReady.date': {
          name: 'deliveryReady',
          group: 'shipment',
        },
      },
      fieldDefinitions: shipmentFieldDefinitions,
    }),
    ...containerColumns({
      sorts: {
        'container.created': {
          local: true,
          default: true,
          name: 'createdAt',
          group: 'container',
        },
        'container.updated': {
          local: true,
          name: 'updatedAt',
          group: 'container',
        },
        'container.no': {
          local: true,
          name: 'no',
          group: 'container',
        },
        'container.containerType': {
          local: true,
          name: 'containerType',
          group: 'container',
        },
        'container.warehouseArrivalAgreedDate': {
          local: true,
          name: 'warehouseArrivalAgreedDate',
          group: 'container',
        },
        'container.warehouseArrivalActualDate': {
          local: true,
          name: 'warehouseArrivalActualDate',
          group: 'container',
        },
        'container.freeTimeStartDate': {
          local: true,
          name: 'freeTimeStartDate',
          group: 'container',
        },
        'container.yardName': {
          local: true,
          name: 'yardName',
          group: 'container',
        },
        'container.departureDate': {
          local: true,
          name: 'departureDate',
          group: 'container',
        },
      },
      fieldDefinitions: containerFieldDefinitions,
    }),
    ...batchColumns({
      sorts: {
        'batch.created': {
          local: true,
          default: true,
          name: 'createdAt',
          group: 'batch',
        },
        'batch.updated': {
          local: true,
          name: 'updatedAt',
          group: 'batch',
        },
        'batch.no': {
          local: true,
          name: 'no',
          group: 'batch',
        },
        'batch.deliveredAt': {
          local: true,
          name: 'deliveredAt',
          group: 'batch',
        },
        'batch.desiredAt': {
          local: true,
          name: 'desiredAt',
          group: 'batch',
        },
        'batch.expiredAt': {
          local: true,
          name: 'expiredAt',
          group: 'batch',
        },
        'batch.producedAt': {
          local: true,
          name: 'producedAt',
          group: 'batch',
        },
        'batch.quantity': {
          local: true,
          name: 'quantity',
          group: 'batch',
        },
        'batch.packageName': {
          local: true,
          name: 'packageName',
          group: 'batch',
        },
        'batch.packageCapacity': {
          local: true,
          name: 'packageCapacity',
          group: 'batch',
        },
        'batch.packageQuantity': {
          local: true,
          name: 'packageQuantity',
          group: 'batch',
        },
      },
      fieldDefinitions: batchFieldDefinitions,
    }),
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
      fieldDefinitions: productFieldDefinitions,
    }),
    ...productProviderColumns({}),
    ...orderColumns({
      fieldDefinitions: orderFieldDefinitions,
    }).filter(
      c =>
        ![
          'order.totalOrdered',
          'order.totalBatched',
          'order.totalShipped',
          'order.totalPrice',
          'order.action',
        ].includes(c.key)
    ),
  ];
}
