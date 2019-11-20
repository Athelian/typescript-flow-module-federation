/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { colors } from 'styles/common';
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import batchMessages from 'modules/batch/messages';
import orderColumns from 'modules/sheet/order/columns';
import orderItemColumns from 'modules/sheet/orderItem/columns';
import shipmentColumns from 'modules/sheet/shipment/columns';
import containerColumns from 'modules/sheet/container/columns';

const batchColumns: Array<ColumnConfig> = [
  {
    key: 'order.orderItem.batch.created',
    exportKey: 'orderItems.batches.createdAt',
    title: <FormattedMessage {...batchMessages.createdAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
    sort: {
      local: true,
      default: true,
      name: 'createdAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.updated',
    exportKey: 'orderItems.batches.updatedAt',
    title: <FormattedMessage {...batchMessages.updatedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
    sort: {
      local: true,
      name: 'updatedAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.archived',
    title: <FormattedMessage {...batchMessages.status} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 105,
  },
  {
    key: 'order.orderItem.batch.no',
    exportKey: 'orderItems.batches.no',
    title: <FormattedMessage {...batchMessages.batchNo} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'no',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.deliveredAt',
    exportKey: 'orderItems.batches.deliveredAt',
    title: <FormattedMessage {...batchMessages.deliveredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
    sort: {
      local: true,
      name: 'deliveredAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.desiredAt',
    exportKey: 'orderItems.batches.desiredAt',
    title: <FormattedMessage {...batchMessages.desiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
    sort: {
      local: true,
      name: 'desiredAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.expiredAt',
    exportKey: 'orderItems.batches.expiredAt',
    title: <FormattedMessage {...batchMessages.expiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
    sort: {
      local: true,
      name: 'expiredAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.producedAt',
    exportKey: 'orderItems.batches.producedAt',
    title: <FormattedMessage {...batchMessages.producedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 125,
    sort: {
      local: true,
      name: 'producedAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.tags',
    exportKey: 'orderItems.batches.tags',
    title: <FormattedMessage {...batchMessages.tags} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.memo',
    exportKey: 'orderItems.batches.memo',
    title: <FormattedMessage {...batchMessages.memo} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.latestQuantity',
    title: <FormattedMessage {...batchMessages.currentQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.quantity',
    exportKey: 'orderItems.batches.quantity',
    title: <FormattedMessage {...batchMessages.initialQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'quantity',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.producedQuantity',
    title: <FormattedMessage {...batchMessages.producedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.preShippedQuantity',
    title: <FormattedMessage {...batchMessages.preShippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.shippedQuantity',
    title: <FormattedMessage {...batchMessages.shippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.postShippedQuantity',
    title: <FormattedMessage {...batchMessages.postShippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.deliveredQuantity',
    title: <FormattedMessage {...batchMessages.deliveredQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.packageName',
    exportKey: 'orderItems.batches.packageName',
    title: <FormattedMessage {...batchMessages.packageName} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'packageName',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.packageCapacity',
    exportKey: 'orderItems.batches.packageCapacity',
    title: <FormattedMessage {...batchMessages.packageCapacity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'packageCapacity',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.packageQuantity',
    exportKey: 'orderItems.batches.packageQuantity',
    title: <FormattedMessage {...batchMessages.packageQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 250,
    sort: {
      local: true,
      name: 'packageQuantity',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.packageGrossWeight',
    exportKey: 'orderItems.batches.packageGrossWeight',
    title: <FormattedMessage {...batchMessages.packageGrossWeight} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.packageVolume',
    exportKey: 'orderItems.batches.packageVolume',
    title: <FormattedMessage {...batchMessages.packageVolume} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.packageSize',
    title: <FormattedMessage {...batchMessages.packageSizeGrouped} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 280,
  },
  {
    key: 'order.orderItem.batch.todo',
    title: <FormattedMessage {...batchMessages.tasks} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.logs',
    title: <FormattedMessage {...batchMessages.logs} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 120,
  },
  {
    key: 'order.orderItem.batch.mask',
    title: <FormattedMessage {...batchMessages.mask} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  // actions
];

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
    ...orderItemColumns(
      {
        'orderItem.created': 'orderItems.createdAt',
        'orderItem.updated': 'orderItems.updatedAt',
        'orderItem.productProvider.product.name': 'orderItems.productProvider.name',
        'orderItem.productProvider.product.serial': 'orderItems.productProvider.product.serial',
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
        'orderItem.productProvider.product.name': {
          local: true,
          name: 'productProvider.product.name',
          group: 'orderItem',
        },
        'orderItem.productProvider.product.serial': {
          local: true,
          name: 'productProvider.product.serial',
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
        'orderItem.totalShipped': {
          local: true,
          name: 'totalShipped',
          group: 'orderItem',
        },
      },
      orderItemFieldDefinitions
    ),
    {
      key: 'orderItem.action',
      title: 'Actions',
      icon: 'ORDER_ITEM',
      color: colors.ORDER_ITEM,
      width: 200,
    },
    ...batchColumns,
    ...batchFieldDefinitions.map(fieldDefinition => ({
      key: `order.orderItem.batch.customField.${fieldDefinition.id}`,
      exportKey: `orderItems.batches.customFields.${fieldDefinition.id}`,
      title: fieldDefinition.name,
      icon: 'BATCH',
      color: colors.BATCH,
      width: 200,
    })),
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
