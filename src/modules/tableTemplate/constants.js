// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getByPath } from 'utils/fp';
import orderMessages from 'modules/order/messages';
import batchMessages from 'modules/batch/messages';
import shipmentMessages from 'modules/shipment/messages';

import {
  metrics as weightMetrics,
  convert as weightConvert,
} from 'modules/form/helpers/metricInput/weightInput';
import {
  metrics as volumeMetrics,
  convert as volumeConvert,
} from 'modules/form/helpers/metricInput/volumeInput';
import {
  metrics as distanceMetrics,
  convert as distanceConvert,
} from 'modules/form/helpers/metricInput/distanceInput';
import { mapColumnId } from './helpers';

export const orderColumns = [
  {
    group: <FormattedMessage id="modules.Orders.order" defaultMessage="ORDER" />,
    columns: [
      <FormattedMessage {...orderMessages.PO} />,
      <FormattedMessage {...orderMessages.PI} />,
      <FormattedMessage {...orderMessages.date} />,
      <FormattedMessage {...orderMessages.exporter} />,
      <FormattedMessage {...orderMessages.currency} />,
      <FormattedMessage {...orderMessages.incoterm} />,
      <FormattedMessage {...orderMessages.deliveryPlace} />,
      <FormattedMessage {...orderMessages.inCharge} />,
      <FormattedMessage {...orderMessages.tags} />,
    ],
  },
];

export const orderItemColumns = [
  {
    group: <FormattedMessage id="modules.Items.item" defaultMessage="ITEM" />,
    columns: [
      <FormattedMessage id="modules.Products.name" defaultMessage="NAME" />,
      <FormattedMessage id="modules.Products.serial" defaultMessage="SERIAL" />,
      <FormattedMessage id="modules.ProductProviders.exporter" defaultMessage="EXPORTER" />,
      <FormattedMessage id="modules.ProductProviders.supplier" defaultMessage="SUPPLIER" />,
      <FormattedMessage id="modules.ProductProviders.unitPrice" defaultMessage="UNIT PRICE" />,
      <FormattedMessage
        id="modules.ProductProviders.unitPriceCurrency"
        defaultMessage="UNIT PRICE CURRENCY"
      />,
      <FormattedMessage id="global.quantity" defaultMessage="QUANTITY" />,
    ],
  },
];

export const batchColumns = [
  {
    group: <FormattedMessage id="modules.Batches.batch" defaultMessage="BATCH" />,
    columns: [
      <FormattedMessage {...batchMessages.batchNo} />,
      <FormattedMessage {...batchMessages.quantity} />,
      <FormattedMessage {...batchMessages.deliveredAt} />,
      <FormattedMessage {...batchMessages.expiredAt} />,
      <FormattedMessage {...batchMessages.producedAt} />,
      <FormattedMessage {...batchMessages.tags} />,
    ],
  },
  {
    group: <FormattedMessage id="modules.Batches.packing" defaultMessage="PACKAGING" />,
    columns: [
      <FormattedMessage {...batchMessages.packageName} />,
      <FormattedMessage {...batchMessages.packageQuantity} />,
      <FormattedMessage {...batchMessages.packageGrossWeight} />,
      <FormattedMessage {...batchMessages.packageVolume} />,
      <FormattedMessage id="modules.Batches.pkgWidth" defaultMessage="PKG WIDTH" />,
      <FormattedMessage id="modules.Batches.pkgHeight" defaultMessage="PKG HEIGHT" />,
      <FormattedMessage id="modules.Batches.pkgLength" defaultMessage="PKG LENGTH" />,
    ],
  },
];

export const shipmentColumns = [
  {
    group: <FormattedMessage id="modules.Shipments.shipment" defaultMessage="SHIPMENT" />,
    columns: [
      <FormattedMessage {...shipmentMessages.shipmentId} />,
      <FormattedMessage {...shipmentMessages.blNo} />,
      <FormattedMessage {...shipmentMessages.blDate} />,
      <FormattedMessage {...shipmentMessages.bookingNo} />,
      <FormattedMessage {...shipmentMessages.bookingDate} />,
      <FormattedMessage {...shipmentMessages.invoiceNo} />,
      <FormattedMessage {...shipmentMessages.transportType} />,
      <FormattedMessage {...shipmentMessages.loadType} />,
      <FormattedMessage {...shipmentMessages.incoterms} />,
      <FormattedMessage {...shipmentMessages.carrier} />,
      <FormattedMessage {...shipmentMessages.forwarder} />,
      <FormattedMessage id="modules.Shipments.inCharge" defaultMessage="IN CHARGE " />,
      <FormattedMessage {...shipmentMessages.tags} />,
    ],
  },
  {
    group: <FormattedMessage id="modules.Shipments.timeline" defaultMessage="TIMELINE" />,
    columns: [
      <FormattedMessage {...shipmentMessages.cargoReady} />,
      <FormattedMessage
        id="modules.Shipments.loadPortDeparture"
        defaultMessage="LOAD PORT DEPARTURE"
      />,
      <FormattedMessage
        id="modules.Shipments.firstTransitPortArrival"
        defaultMessage="FIRST TRANSIT PORT ARRIVAL"
      />,
      <FormattedMessage
        id="modules.Shipments.firstTransitPortDeparture"
        defaultMessage="FIRST TRANSIT PORT DEPARTURE"
      />,
      <FormattedMessage
        id="modules.Shipments.secondTransitPortArrival"
        defaultMessage="SECOND TRANSIT PORT ARRIVAL"
      />,
      <FormattedMessage
        id="modules.Shipments.secondTransitPortDeparture"
        defaultMessage="SECOND TRANSIT PORT DEPARTURE"
      />,
      <FormattedMessage
        id="modules.Shipments.dischargePortArrival"
        defaultMessage="DISCHARGE PORT ARRIVAL"
      />,
      <FormattedMessage
        id="modules.Shipments.customsClearance"
        defaultMessage="CUSTOMS CLEARANCE"
      />,
      <FormattedMessage
        id="modules.Shipments.warehouseArrival"
        defaultMessage="WAREHOUSE ARRIVAL"
      />,
      <FormattedMessage id="modules.Shipments.deliveryReady" defaultMessage="DELIVERY READY" />,
    ],
  },
];

export const orderColumnFields = [
  {
    name: 'poNo',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    name: 'piNo',
    type: 'text',
  },
  {
    name: 'issuedAt',
    type: 'date',
  },
  {
    name: 'exporter.name',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    name: 'currency',
    type: 'enum',
    meta: {
      enumType: 'Currency',
      isRequired: true,
    },
  },
  {
    name: 'incoterm',
    type: 'enum',
    meta: {
      enumType: 'Incoterm',
    },
  },
  {
    name: 'deliveryPlace',
    type: 'text',
  },
  {
    name: 'inCharges',
    type: 'inCharges',
    meta: {
      max: 5,
    },
  },
  {
    name: 'tags',
    type: 'tags',
    meta: {
      tagType: 'Order',
    },
  },
];

export const orderItemColumnFields = [
  {
    name: 'productProvider',
    type: 'productProvider',
  },
  {
    name: 'productProvider.product.serial',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    name: 'productProvider.exporter.name',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    name: 'productProvider.supplier.name',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    name: 'price.amount',
    type: 'number',
    meta: {
      isRequired: true,
    },
  },
  {
    name: 'price.currency',
    type: 'enum',
    meta: {
      enumType: 'Currency',
      isRequired: true,
    },
  },
  {
    name: 'quantity',
    type: 'number',
    meta: {
      isRequired: true,
    },
  },
];

export const batchColumnFields = [
  {
    name: 'no',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    name: 'quantity',
    type: 'numberAdjustment',
    meta: {
      isRequired: true,
    },
  },
  {
    name: 'deliveredAt',
    type: 'date',
  },
  {
    name: 'expiredAt',
    type: 'date',
  },
  {
    name: 'producedAt',
    type: 'date',
  },
  {
    name: 'tags',
    type: 'tags',
    meta: {
      tagType: 'Batch',
    },
  },
  {
    name: 'packageName',
    type: 'text',
  },
  {
    name: 'packageQuantity',
    type: 'number',
  },
  {
    name: 'packageGrossWeight',
    type: 'metric',
    meta: {
      metrics: weightMetrics,
      convert: weightConvert,
    },
  },
  {
    name: 'packageVolume',
    type: 'metric',
    meta: {
      metrics: volumeMetrics,
      convert: volumeConvert,
    },
  },
  {
    name: 'packageSize.width',
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: distanceConvert,
      sourcePath: 'packageSize',
      destPath: 'width',
    },
  },
  {
    name: 'packageSize.height',
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: distanceConvert,
      sourcePath: 'packageSize',
      destPath: 'height',
    },
  },
  {
    name: 'packageSize.length',
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: distanceConvert,
      sourcePath: 'packageSize',
      destPath: 'length',
    },
  },
];

export const shipmentColumnFields = [
  {
    name: 'no',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    name: 'blNo',
    type: 'text',
  },
  {
    name: 'blDate',
    type: 'date',
  },
  {
    name: 'bookingNo',
    type: 'text',
  },
  {
    name: 'bookingDate',
    type: 'date',
  },
  {
    name: 'invoiceNo',
    type: 'text',
  },
  {
    name: 'transportType',
    type: 'enum',
    meta: {
      enumType: 'TransportType',
    },
  },
  {
    name: 'loadType',
    type: 'enum',
    meta: {
      enumType: 'LoadType',
    },
  },
  {
    name: 'incoterm',
    type: 'enum',
    meta: {
      enumType: 'Incoterm',
    },
  },
  {
    name: 'carrier',
    type: 'text',
  },
  {
    name: 'forwarders',
    type: 'forwarders',
    meta: {
      max: 4,
    },
  },
  {
    name: 'inCharges',
    type: 'inCharges',
    meta: {
      max: 5,
    },
  },
  {
    name: 'tags',
    type: 'tags',
    meta: {
      tagType: 'Shipment',
    },
  },
  {
    name: 'cargoReady',
    type: 'timeline',
  },
  {
    name: 'voyages.0.departure',
    type: 'timeline',
  },
  {
    getFieldValue: ({ voyages }: { voyages: Array<Object> }) =>
      getByPath(`${voyages && voyages.length > 1 ? '0' : ''}.arrival`, voyages),
    name: 'voyages.0.arrival',
    type: 'timeline',
  },
  {
    name: 'voyages.1.departure',
    type: 'timeline',
  },
  {
    name: 'voyages.1.arrival',
    type: 'timeline',
  },
  {
    name: 'voyages.2.departure',
    type: 'timeline',
  },
  {
    getFieldValue: ({ voyages }: { voyages: Array<Object> }) => {
      const index = voyages ? voyages.length - 1 : 0;
      return getByPath(`${index}.arrival`, voyages);
    },
    name: 'voyages.2.arrival',
    type: 'timeline',
  },
  {
    name: 'containerGroups.0.customClearance',
    type: 'timeline',
  },
  {
    name: 'containerGroups.0.warehouseArrival',
    type: 'timeline',
  },
  {
    name: 'containerGroups.0.deliveryReady',
    type: 'timeline',
  },
];

export const orderColumnIds: Array<string> = orderColumnFields.map(mapColumnId('ORDER'));

export const orderItemColumnIds: Array<string> = orderItemColumnFields.map(
  mapColumnId('ORDER_ITEM')
);

export const batchColumnIds: Array<string> = batchColumnFields.map(mapColumnId('BATCH'));

export const shipmentColumnIds: Array<string> = shipmentColumnFields.map(mapColumnId('SHIPMENT'));

export const allColumnIds = [
  ...orderColumnIds,
  ...orderItemColumnIds,
  ...batchColumnIds,
  ...shipmentColumnIds,
];
