// @flow
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import orderColumns from 'modules/sheet/order/columns';
import orderItemColumns from 'modules/sheet/orderItem/columns';
import shipmentColumns from 'modules/sheet/shipment/columns';
import containerColumns from 'modules/sheet/container/columns';
import batchColumns from 'modules/sheet/batch/columns';

export const FieldDefinitionEntityTypes = ['Order', 'OrderItem', 'Batch', 'Shipment'];

type Props = {
  orderFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
};

export default function({
  orderFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
}: Props): Array<ColumnConfig> {
  return [
    ...shipmentColumns(
      {
        'shipment.created': 'createdAt',
        'shipment.updated': 'updatedAt',
        'shipment.no': 'no',
        'shipment.forwarders': 'forwarders',
        'shipment.relatedExporters': 'relatedExporters',
        'shipment.blNo': 'blNo',
        'shipment.blDate': 'blDate',
        'shipment.bookingNo': 'bookingNo',
        'shipment.bookingDate': 'bookingDate',
        'shipment.invoiceNo': 'invoiceNo',
        'shipment.transportType': 'transportType',
        'shipment.loadType': 'loadType',
        'shipment.incoterm': 'incoterm',
        'shipment.carrier': 'carrier',
        'shipment.tags': 'tags',
        'shipment.memo': 'memo',
        'shipment.inCharges': 'inCharges',
        'shipment.cargoReady.date': 'cargoReady.date',
        'shipment.voyage.0.departurePort': 'voyage_1.departurePort',
        'shipment.voyage.0.departure.date': 'voyage_1.departure.date',
        'shipment.voyage.0.firstTransitPort': 'voyage_1.arrivalPort',
        'shipment.voyage.0.firstTransitArrival.date': 'voyage_1.arrival.date',
        'shipment.voyage.1.firstTransitDeparture.date': 'voyage_2.departure.date',
        'shipment.voyage.1.secondTransitPort': 'voyage_2.arrivalPort',
        'shipment.voyage.1.secondTransitArrival.date': 'voyage_2.arrival.date',
        'shipment.voyage.2.secondTransitDeparture.date': 'voyage_3.departure.date',
        'shipment.voyage.2.arrivalPort': 'voyage_3.arrivalPort',
        'shipment.voyage.2.arrival.date': 'voyage_3.arrival.date',
        'shipment.containerGroup.customClearance.date': 'containerGroup.customClearance.date',
        'shipment.containerGroup.warehouse': 'containerGroup.warehouse.name',
        'shipment.containerGroup.warehouseArrival.date': 'containerGroup.warehouseArrival.date',
        'shipment.containerGroup.deliveryReady.date': 'containerGroup.deliveryReady.date',
      },
      {
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
      shipmentFieldDefinitions
    ),
    ...containerColumns(
      {
        'container.created': 'containers.createdAt',
        'container.updated': 'containers.updatedAt',
        'container.no': 'containers.no',
        'container.warehouseArrivalAgreedDate': 'containers.warehouseArrivalAgreedDate',
        'container.warehouseArrivalActualDate': 'containers.warehouseArrivalActualDate',
        'container.warehouse': 'containers.warehouse.name',
        'container.freeTimeStartDate': 'containers.freeTimeStartDate',
        'container.freeTimeDuration': 'containers.freeTimeDuration',
        'container.yardName': 'containers.yardName',
        'container.departureDate': 'containers.departureDate',
        'container.memo': 'containers.memo',
      },
      {
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
      }
    ),
    ...batchColumns(
      {
        'batch.no': 'containers.batches.no',
        'batch.quantity': 'containers.batches.quantity',
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
    ...orderItemColumns(
      {
        'orderItem.productProvider.product.name':
          'containers.batches.orderItem.productProvider.product.name',
        'orderItem.productProvider.product.serial':
          'containers.batches.orderItem.productProvider.product.serial',
      },
      {},
      orderItemFieldDefinitions
    ).filter(
      c =>
        ![
          'orderItem.remainQuantity',
          'orderItem.totalBatched',
          'orderItem.totalShipped',
          'orderItem.totalPrice',
          'orderItem.action',
        ].includes(c.key)
    ),
    ...orderColumns(
      {
        'order.poNo': 'containers.batches.orderItem.order.poNo',
      },
      {},
      orderFieldDefinitions
    ).filter(
      c =>
        ![
          'order.totalOrdered',
          'order.totalBatched',
          'order.totalShipped',
          'order.totalPrice',
        ].includes(c.key)
    ),
  ];
}
