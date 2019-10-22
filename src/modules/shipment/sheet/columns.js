// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { colors } from 'styles/common';
import type { ColumnConfig } from 'components/Sheet';
import shipmentMessages from 'modules/shipment/messages';
import containerMessages from '../../container/messages';
import batchMessages from '../../batch/messages';
import orderItemMessages from '../../orderItem/messages';

const shipmentColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.created',
    title: <FormattedMessage {...shipmentMessages.createdAt} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  {
    key: 'shipment.updated',
    title: <FormattedMessage {...shipmentMessages.updatedAt} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
  },
  // archived
  {
    key: 'shipment.archived',
    title: <FormattedMessage {...shipmentMessages.status} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.no',
    title: <FormattedMessage {...shipmentMessages.shipmentId} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  // importer
  // exporter
  // forwarders
  // related exporters
  {
    key: 'shipment.blNo',
    title: <FormattedMessage {...shipmentMessages.blNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.blDate',
    title: <FormattedMessage {...shipmentMessages.blDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
  },
  {
    key: 'shipment.bookingNo',
    title: <FormattedMessage {...shipmentMessages.bookingNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  // booked
  {
    key: 'shipment.bookingDate',
    title: <FormattedMessage {...shipmentMessages.bookingDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
  },
  {
    key: 'shipment.invoiceNo',
    title: <FormattedMessage {...shipmentMessages.invoiceNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.contractNo',
    title: <FormattedMessage {...shipmentMessages.contractNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.transportType',
    title: <FormattedMessage {...shipmentMessages.transportType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.loadType',
    title: <FormattedMessage {...shipmentMessages.loadType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.incoterm',
    title: <FormattedMessage {...shipmentMessages.incoterms} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'shipment.carrier',
    title: <FormattedMessage {...shipmentMessages.carrier} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  // tags
  // memo
  // in charges
  // nb of voyages
  // cargo ready date
  // cargo ready date revisions
  // cargo ready assigned to
  // cargo ready approval
  {
    key: 'shipment.cargoReady.date',
    title: <FormattedMessage {...shipmentMessages.cargoReady} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
  },
  {
    key: 'shipment.cargoReady.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.cargoReadyRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.containerGroups.customClearance.date',
    title: <FormattedMessage {...shipmentMessages.customClearance} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
  },
  {
    key: 'shipment.containerGroups.customClearance.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.customClearanceRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  /* {
    key: 'shipment.containerGroups.warehouseArrival.date',
    title: <FormattedMessage {...shipmentMessages.warehouseArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
  },
  {
    key: 'shipment.containerGroups.warehouseArrival.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.warehouseArrivalRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  }, */
  {
    key: 'shipment.containerGroups.deliveryReady.date',
    title: <FormattedMessage {...shipmentMessages.deliveryReady} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
  },
  {
    key: 'shipment.containerGroups.deliveryReady.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.deliveryReadyRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'shipment.files',
    title: <FormattedMessage {...shipmentMessages.sectionDocuments} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
];

const containerColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.container.created',
    title: <FormattedMessage {...containerMessages.createdAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'shipment.container.updated',
    title: <FormattedMessage {...containerMessages.updatedAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
  },
  {
    key: 'shipment.container.archived',
    title: <FormattedMessage {...containerMessages.status} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 105,
  },
  {
    key: 'shipment.container.no',
    title: <FormattedMessage {...containerMessages.containerNo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'shipment.container.containerType',
    title: <FormattedMessage {...containerMessages.containerType} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  // ctn option
  {
    key: 'shipment.container.warehouseArrivalAgreedDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 170,
  },
  // agreed arrival assigned to
  // agreed arrival approval
  {
    key: 'shipment.container.warehouseArrivalActualDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 170,
  },
  // actual arrival assigned to
  // actual arrival approval
  // free time
  // start date
  // start date auto
  // duration
  // due date
  {
    key: 'shipment.container.yardName',
    title: 'Yard Name',
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'shipment.container.departureDate',
    title: 'Yard Departure Date',
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 140,
  },
  // departure assigned to
  // departure approval
  // tags
  // memo
  // total package quantity
  // total quantity
  // total volume
  // total weight
  // total price
  // actions
];

const batchColumns: Array<ColumnConfig> = [
  {
    key: 'shipment.container.batch.created',
    title: <FormattedMessage {...batchMessages.createdAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
  },
  {
    key: 'shipment.container.batch.updated',
    title: <FormattedMessage {...batchMessages.updatedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
  },
  {
    key: 'shipment.container.batch.archived',
    title: <FormattedMessage {...orderItemMessages.status} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 105,
  },
  {
    key: 'shipment.container.batch.no',
    title: <FormattedMessage {...batchMessages.batchNo} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.deliveredAt',
    title: <FormattedMessage {...batchMessages.deliveredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
  },
  {
    key: 'shipment.container.batch.desiredAt',
    title: <FormattedMessage {...batchMessages.desiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
  },
  {
    key: 'shipment.container.batch.expiredAt',
    title: <FormattedMessage {...batchMessages.expiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
  },
  {
    key: 'shipment.container.batch.producedAt',
    title: <FormattedMessage {...batchMessages.producedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
  },
  // tags
  // memo
  {
    key: 'shipment.container.batch.quantity',
    title: <FormattedMessage {...batchMessages.initialQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.quantityRevisions',
    title: <FormattedMessage {...batchMessages.sectionAdjustments} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 1035,
  },
  {
    key: 'shipment.container.batch.packageName',
    title: <FormattedMessage {...batchMessages.packageName} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  {
    key: 'shipment.container.batch.packageCapacity',
    title: <FormattedMessage {...batchMessages.packageCapacity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  // pkg qty
  // pkg auto qty
  // pkg weight
  // pkg vol
  // pkg auto vol
  // pkg size
  // tasks
  // custom fields mask
  // custom fields
  // actions
];

const orderItemColumns: Array<ColumnConfig> = [];

const orderColumns: Array<ColumnConfig> = [];

const columns: Array<ColumnConfig> = [
  ...shipmentColumns,
  ...containerColumns,
  ...batchColumns,
  ...orderItemColumns,
  ...orderColumns,
];

export default columns;
