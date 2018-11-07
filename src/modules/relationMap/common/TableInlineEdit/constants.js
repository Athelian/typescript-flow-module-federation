// @flow
import * as React from 'react';
import orderMessages from 'modules/order/messages';
import { FormattedMessage } from 'react-intl';

export const orderColumnFields = [
  {
    name: 'poNo',
    type: 'text',
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
    name: 'currency',
    type: 'enum',
  },
  {
    name: 'incoterm',
    type: 'enum',
  },
  {
    name: 'deliveryPlace',
    type: 'text',
  },
  {
    name: 'memo',
    type: 'text',
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
    group: 'ORDER',
    columns: [
      <FormattedMessage {...orderMessages.PO} />,
      <FormattedMessage {...orderMessages.PI} />,
      <FormattedMessage {...orderMessages.date} />,
      <FormattedMessage {...orderMessages.currency} />,
      <FormattedMessage {...orderMessages.incoterm} />,
      <FormattedMessage {...orderMessages.deliveryPlace} />,
      <FormattedMessage {...orderMessages.memo} />,
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
