// @flow
import * as React from 'react';
import orderMessages from 'modules/order/messages';
import batchMessages from 'modules/batch/messages';
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
    type: 'number',
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
    name: 'packageName',
    type: 'text',
  },
  {
    name: 'packageQuantity',
    type: 'number',
  },
  {
    name: 'tags',
    type: 'tags',
    meta: {
      tagType: 'Batch',
    },
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
    group: 'General',
    columns: [
      <FormattedMessage {...batchMessages.batchNo} />,
      <FormattedMessage {...batchMessages.quantity} />,
      <FormattedMessage {...batchMessages.deliveredAt} />,
      <FormattedMessage {...batchMessages.expiredAt} />,
      <FormattedMessage {...batchMessages.producedAt} />,
      <FormattedMessage {...batchMessages.packageName} />,
      <FormattedMessage {...batchMessages.packageQuantity} />,
      <FormattedMessage {...batchMessages.tags} />,
    ],
  },
];

export const shipmentColumns = [
  {
    group: 'General',
    columns: ['Shipment ID', 'B/L No.'],
  },
];
