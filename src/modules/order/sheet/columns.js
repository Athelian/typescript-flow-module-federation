// @flow
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import orderColumns from 'modules/sheet/order/columns';
import orderItemColumns from 'modules/sheet/orderItem/columns';
import batchColumns from 'modules/sheet/batch/columns';
import shipmentColumns from 'modules/sheet/shipment/columns';
import containerColumns from 'modules/sheet/container/columns';
import productColumns from 'modules/sheet/product/columns';

export const FieldDefinitionEntityTypes = ['Order', 'Product', 'OrderItem', 'Batch', 'Shipment'];

export const OrderSheetColumnGroupTypes = ['ORDER', 'ORDER_ITEM', 'BATCH', 'CONTAINER', 'SHIPMENT'];

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
    ...orderColumns(
      {
        'order.created': 'createdAt',
        'order.updated': 'updatedAt',
        'order.poNo': 'poNo',
        'order.exporter': 'exporter.name',
        'order.piNo': 'piNo',
        'order.issuedAt': 'issuedAt',
        'order.deliveryDate': 'deliveryDate',
        'order.currency': 'currency',
        'order.incoterm': 'incoterm',
        'order.deliveryPlace': 'deliveryPlace',
        'order.tags': 'tags',
        'order.memo': 'memo',
        'order.customField': 'customFields',
      },
      {
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
      orderFieldDefinitions
    ),
    ...productColumns({}, {}, productFieldDefinitions),
    ...orderItemColumns(
      {
        'orderItem.created': 'orderItems.createdAt',
        'orderItem.updated': 'orderItems.updatedAt',
        'orderItem.no': 'orderItems.no',
        'orderItem.quantity': 'orderItems.quantity',
        'orderItem.price': 'orderItems.price.amount',
        'orderItem.memo': 'orderItems.memo',
      },
      {
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
        'orderItem.remainingBatchQuantity': {
          local: true,
          name: 'remainingBatchQuantity',
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
      orderItemFieldDefinitions
    ),
    ...batchColumns(
      {
        'batch.created': 'orderItems.batches.createdAt',
        'batch.updated': 'orderItems.batches.updatedAt',
        'batch.no': 'orderItems.batches.no',
        'batch.deliveredAt': 'orderItems.batches.deliveredAt',
        'batch.desiredAt': 'orderItems.batches.desiredAt',
        'batch.expiredAt': 'orderItems.batches.expiredAt',
        'batch.producedAt': 'orderItems.batches.producedAt',
        'batch.tags': 'orderItems.batches.tags',
        'batch.memo': 'orderItems.batches.memo',
        'batch.quantity': 'orderItems.batches.quantity',
        'batch.packageName': 'orderItems.batches.packageName',
        'batch.packageCapacity': 'orderItems.batches.packageCapacity',
        'batch.packageQuantity': 'orderItems.batches.packageQuantity',
        'batch.packageGrossWeight': 'orderItems.batches.packageGrossWeight',
        'batch.packageVolume': 'orderItems.batches.packageVolume',
      },
      {
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
      batchFieldDefinitions
    ),
    ...containerColumns(
      {},
      {
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
      }
    ).filter(
      c =>
        ![
          'container.totalPrice',
          'container.totalBatchQuantity',
          'container.totalPackages',
          'container.totalWeight',
          'container.totalVolume',
        ].includes(c.key)
    ),
    ...shipmentColumns(
      {
        'shipment.created': 'orderItems.batches.shipment.createdAt',
        'shipment.updated': 'orderItems.batches.shipment.updatedAt',
        'shipment.no': 'orderItems.batches.shipment.no',
        'shipment.forwarders': 'orderItems.batches.shipment.forwarders',
        'shipment.blNo': 'orderItems.batches.shipment.blNo',
        'shipment.blDate': 'orderItems.batches.shipment.blDate',
        'shipment.bookingNo': 'orderItems.batches.shipment.bookingNo',
        'shipment.bookingDate': 'orderItems.batches.shipment.bookingDate',
        'shipment.invoiceNo': 'orderItems.batches.shipment.invoiceNo',
        'shipment.transportType': 'orderItems.batches.shipment.transportType',
        'shipment.loadType': 'orderItems.batches.shipment.loadType',
        'shipment.incoterm': 'orderItems.batches.shipment.incoterm',
        'shipment.carrier': 'orderItems.batches.shipment.carrier',
        'shipment.tags': 'orderItems.batches.shipment.tags',
        'shipment.memo': 'orderItems.batches.shipment.memo',
        'shipment.inCharges': 'orderItems.batches.shipment.inCharges',
        'shipment.cargoReady.date': 'orderItems.batches.shipment.cargoReady.date',
        'shipment.voyage.0.departurePort': 'orderItems.batches.shipment.voyage_1.departurePort',
        'shipment.voyage.0.departure.date': 'orderItems.batches.shipment.voyage_1.departure.date',
        'shipment.voyage.0.firstTransitPort': 'orderItems.batches.shipment.voyage_1.arrivalPort',
        'shipment.voyage.0.firstTransitArrival.date':
          'orderItems.batches.shipment.voyage_1.arrival.date',
        'shipment.voyage.1.firstTransitDeparture.date':
          'orderItems.batches.shipment.voyage_2.departure.date',
        'shipment.voyage.1.secondTransitPort': 'orderItems.batches.shipment.voyage_2.departurePort',
        'shipment.voyage.1.secondTransitArrival.date':
          'orderItems.batches.shipment.voyage_2.arrival.date',
        'shipment.voyage.2.secondTransitDeparture.date':
          'orderItems.batches.shipment.voyage_3.departure.date',
        'shipment.voyage.2.arrivalPort': 'orderItems.batches.shipment.voyage_3.arrivalPort',
        'shipment.voyage.2.arrival.date': 'orderItems.batches.shipment.voyage_3.arrival.date',
        'shipment.containerGroup.customClearance.date':
          'orderItems.batches.shipment.containerGroup.customClearance.date',
        'shipment.containerGroup.warehouse':
          'orderItems.batches.shipment.containerGroup.warehouse.name',
        'shipment.containerGroup.warehouseArrival.date':
          'orderItems.batches.shipment.containerGroup.warehouseArrival.date',
        'shipment.containerGroup.deliveryReady.date':
          'orderItems.batches.shipment.containerGroup.deliveryReady.date',
      },
      {
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
      },
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
