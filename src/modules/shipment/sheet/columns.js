// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { colors } from 'styles/common';
import type { ColumnConfig } from 'components/Sheet';
import shipmentMessages from 'modules/shipment/messages';

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

const containerColumns: Array<ColumnConfig> = [];

const batchColumns: Array<ColumnConfig> = [];

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
