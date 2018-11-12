// @flow
import * as React from 'react';
import orderMessages from 'modules/order/messages';
import { FormattedMessage } from 'react-intl';

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
  },
];

export const orderItemColumnFields = [
  {
    name: 'productProvider.product.name',
    type: 'text',
  },
  {
    name: 'productProvider.product.serial',
    type: 'text',
  },
  {
    name: 'productProvider.supplier.name',
    type: 'text',
  },
  {
    name: 'price.amount',
    type: 'number',
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
  },
];

export const batchColumnFields = [
  {
    name: 'no',
    type: 'text',
  },
  {
    name: 'quantity',
    type: 'number',
  },
];

export const shipmentColumnFields = [
  {
    name: 'no',
    type: 'text',
  },
  {
    name: 'blNo',
    type: 'text',
  },
];

export const orderColumns = [
  {
    group: 'General',
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
    group: 'General',
    columns: [
      <FormattedMessage id="modules.Products.name" defaultMessage="NAME" />,
      <FormattedMessage id="modules.Products.serial" defaultMessage="SERIAL" />,
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
    group: 'General',
    columns: ['Batch No.', 'Initial Quantity'],
  },
];

export const shipmentColumns = [
  {
    group: 'General',
    columns: ['Shipment ID', 'B/L No.'],
  },
];
