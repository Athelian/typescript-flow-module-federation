// @flow
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import orderColumns from 'modules/sheet/order/columns';
import orderItemColumns from 'modules/sheet/orderItem/columns';
import batchColumns from 'modules/sheet/batch/columns';
import shipmentColumns from 'modules/sheet/shipment/columns';
import containerColumns from 'modules/sheet/container/columns';
import productColumns from 'modules/sheet/product/columns';
import productProviderColumns from 'modules/sheet/productProvider/columns';

export const FieldDefinitionEntityTypes = [
  'Order',
  'Product',
  'ProductProvider',
  'OrderItem',
  'Batch',
  'Shipment',
  'Container',
];

export const OrderSheetColumnGroups = [
  'ORDER',
  'PRODUCT',
  'PRODUCT_PROVIDER',
  'ORDER_ITEM',
  'BATCH',
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
    ...orderColumns({
      sorts: {
        'order.created': {
          name: 'createdAt',
          group: 'order',
        },
        'order.updated': {
          default: true,
          name: 'updatedAt',
          group: 'order',
        },
        'order.poNo': {
          name: 'poNo',
          group: 'order',
        },
        'order.piNo': {
          name: 'piNo',
          group: 'order',
        },
        'order.currency': {
          name: 'currency',
          group: 'order',
        },
      },
      fieldDefinitions: orderFieldDefinitions,
    }),
    ...productColumns({
      fieldDefinitions: productFieldDefinitions,
    }),
    ...productProviderColumns({}),
    ...orderItemColumns({
      sorts: {
        'orderItem.created': {
          local: true,
          default: true,
          name: 'createdAt',
          group: 'orderItem',
        },
        'orderItem.updated': {
          local: true,
          name: 'updatedAt',
          group: 'orderItem',
        },
        'orderItem.no': {
          local: true,
          name: 'no',
          group: 'orderItem',
        },
        'orderItem.quantity': {
          local: true,
          name: 'quantity',
          group: 'orderItem',
        },
        'orderItem.price': {
          local: true,
          name: 'price',
          group: 'orderItem',
        },
        'orderItem.deliveryDate': {
          local: true,
          name: 'deliveryDate',
          group: 'orderItem',
        },
        'orderItem.totalBatched': {
          local: true,
          name: 'totalBatched',
          group: 'orderItem',
        },
        'orderItem.remainingBatchedQuantity': {
          local: true,
          name: 'remainingBatchedQuantity',
          group: 'orderItem',
        },
        'orderItem.totalShipped': {
          local: true,
          name: 'totalShipped',
          group: 'orderItem',
        },
        'orderItem.remainingShippedQuantity': {
          local: true,
          name: 'remainingShippedQuantity',
          group: 'orderItem',
        },
      },
      fieldDefinitions: orderItemFieldDefinitions,
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
    ...containerColumns({
      sorts: {
        'container.created': {
          local: true,
          name: 'containerCreateAt',
          group: 'batch',
        },
        'container.updated': {
          local: true,
          name: 'containerUpdatedAt',
          group: 'batch',
        },
        'container.no': {
          local: true,
          name: 'containerNo',
          group: 'batch',
        },
        'container.warehouseArrivalAgreedDate': {
          local: true,
          name: 'containerWarehouseArrivalAgreedDate',
          group: 'batch',
        },
        'container.warehouseArrivalActualDate': {
          local: true,
          name: 'containerWarehouseArrivalActualDate',
          group: 'batch',
        },
        'container.yardName': {
          local: true,
          name: 'containerYardName',
          group: 'batch',
        },
        'container.departureDate': {
          local: true,
          name: 'containerDepartureDate',
          group: 'batch',
        },
      },
      fieldDefinitions: containerFieldDefinitions,
    }).filter(
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
    ...shipmentColumns({
      sorts: {
        'shipment.created': {
          local: true,
          name: 'shipmentCreatedAt',
          group: 'batch',
        },
        'shipment.updated': {
          local: true,
          name: 'shipmentUpdatedAt',
          group: 'batch',
        },
        'shipment.no': {
          local: true,
          name: 'shipmentNo',
          group: 'batch',
        },
        'shipment.blNo': {
          local: true,
          name: 'shipmentBlNo',
          group: 'batch',
        },
        'shipment.blDate': {
          local: true,
          name: 'shipmentBlDate',
          group: 'batch',
        },
        'shipment.bookingNo': {
          local: true,
          name: 'shipmentBookingNo',
          group: 'batch',
        },
        'shipment.bookingDate': {
          local: true,
          name: 'shipmentBookingDate',
          group: 'batch',
        },
        'shipment.invoiceNo': {
          local: true,
          name: 'shipmentInvoiceNo',
          group: 'batch',
        },
        'shipment.contractNo': {
          local: true,
          name: 'shipmentContractNo',
          group: 'batch',
        },
        'shipment.carrier': {
          local: true,
          name: 'shipmentCarrier',
          group: 'batch',
        },
        'shipment.numOfVoyages': {
          local: true,
          name: 'shipmentNumOfVoyages',
          group: 'batch',
        },
        'shipment.voyage.0.departurePort': {
          local: true,
          name: 'shipmentLoadPort',
          group: 'batch',
        },
        'shipment.voyage.0.departure.latestDate': {
          local: true,
          name: 'shipmentLoadPortDeparture',
          group: 'batch',
        },
        'shipment.voyage.2.arrivalPort': {
          local: true,
          name: 'shipmentDischargePort',
          group: 'batch',
        },
        'shipment.voyage.2.arrival.latestDate': {
          local: true,
          name: 'shipmentDischargePortArrival',
          group: 'batch',
        },
      },
      fieldDefinitions: shipmentFieldDefinitions,
    }).filter(
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
