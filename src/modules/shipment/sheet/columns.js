/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { colors } from 'styles/common';
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import batchMessages from 'modules/batch/messages';
import orderItemMessages from 'modules/orderItem/messages';
import orderColumns from 'modules/sheet/order/columns';
import shipmentColumns from 'modules/sheet/shipment/columns';
import containerColumns from 'modules/sheet/container/columns';

const batchColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.container.batch.created',
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
    key: 'shipment.container.batch.updated',
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
    key: 'shipment.container.batch.archived',
    title: <FormattedMessage {...batchMessages.status} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 105,
  },
  {
    key: 'shipment.container.batch.no',
    exportKey: 'containers.batches.no',
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
    key: 'shipment.container.batch.deliveredAt',
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
    key: 'shipment.container.batch.desiredAt',
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
    key: 'shipment.container.batch.expiredAt',
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
    key: 'shipment.container.batch.producedAt',
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
    key: 'shipment.container.batch.tags',
    title: <FormattedMessage {...batchMessages.tags} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.memo',
    title: <FormattedMessage {...batchMessages.memo} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.latestQuantity',
    title: <FormattedMessage {...batchMessages.currentQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.quantity',
    exportKey: 'containers.batches.quantity',
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
    key: 'shipment.container.batch.producedQuantity',
    title: <FormattedMessage {...batchMessages.producedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.preShippedQuantity',
    title: <FormattedMessage {...batchMessages.preShippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.shippedQuantity',
    title: <FormattedMessage {...batchMessages.shippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.postShippedQuantity',
    title: <FormattedMessage {...batchMessages.postShippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.deliveredQuantity',
    title: <FormattedMessage {...batchMessages.deliveredQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.packageName',
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
    key: 'shipment.container.batch.packageCapacity',
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
    key: 'shipment.container.batch.packageQuantity',
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
    key: 'shipment.container.batch.packageGrossWeight',
    title: <FormattedMessage {...batchMessages.packageGrossWeight} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.packageVolume',
    title: <FormattedMessage {...batchMessages.packageVolume} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.packageSize',
    title: <FormattedMessage {...batchMessages.packageSizeGrouped} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 280,
  },
  {
    key: 'shipment.container.batch.todo',
    title: <FormattedMessage {...batchMessages.tasks} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.logs',
    title: <FormattedMessage {...batchMessages.logs} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 120,
  },
  {
    key: 'shipment.container.batch.mask',
    title: <FormattedMessage {...batchMessages.mask} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  // actions
];

const orderItemColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.container.batch.orderItem.created',
    title: <FormattedMessage {...orderItemMessages.createdAt} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 110,
  },
  {
    key: 'shipment.container.batch.orderItem.updated',
    title: <FormattedMessage {...orderItemMessages.updatedAt} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 110,
  },
  {
    key: 'shipment.container.batch.orderItem.archived',
    title: <FormattedMessage {...orderItemMessages.status} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 105,
  },
  {
    key: 'shipment.container.batch.orderItem.productProvider.product.name',
    exportKey: 'containers.batches.orderItem.productProvider.product.name',
    title: <FormattedMessage {...orderItemMessages.productName} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.productProvider.product.serial',
    exportKey: 'containers.batches.orderItem.productProvider.product.serial',
    title: <FormattedMessage {...orderItemMessages.productSerial} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.no',
    title: <FormattedMessage {...orderItemMessages.no} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.quantity',
    title: <FormattedMessage {...orderItemMessages.quantity} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.price',
    exportKey: 'containers.batches.orderItem.price',
    title: <FormattedMessage {...orderItemMessages.unitPrice} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.deliveryDate',
    title: <FormattedMessage {...orderItemMessages.deliveryDate} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 125,
  },
  {
    key: 'shipment.container.batch.orderItem.tags',
    title: <FormattedMessage {...orderItemMessages.tags} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.memo',
    title: <FormattedMessage {...orderItemMessages.memo} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.files',
    title: <FormattedMessage {...orderItemMessages.sectionDocuments} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.todo',
    title: <FormattedMessage {...orderItemMessages.tasks} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'shipment.container.batch.orderItem.logs',
    title: <FormattedMessage {...orderItemMessages.logs} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 120,
  },
  {
    key: 'shipment.container.batch.orderItem.mask',
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
    ...batchColumns,
    ...batchFieldDefinitions.map(fieldDefinition => ({
      key: `shipment.container.batch.customField.${fieldDefinition.id}`,
      exportKey: `containers.batches.customFields.${fieldDefinition.id}`,
      title: fieldDefinition.name,
      icon: 'BATCH',
      color: colors.BATCH,
      width: 200,
    })),
    ...orderItemColumns,
    ...orderItemFieldDefinitions.map(fieldDefinition => ({
      key: `shipment.container.batch.orderItem.customField.${fieldDefinition.id}`,
      title: fieldDefinition.name,
      icon: 'ORDER_ITEM',
      color: colors.ORDER_ITEM,
      width: 200,
    })),
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
