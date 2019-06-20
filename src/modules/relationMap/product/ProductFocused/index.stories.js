/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import ProductFocused from './index';

storiesOf('RelationMap/ProductFocused', module).add('ProductFocusedView', () => {
  const batch = {
    id: '324234',
    no: 'batch1',
    quantity: 400,
    tags: [],
    orderItem: {
      order: {
        ids: 'ids',
      },
    },
    shipment: {
      blNo: 'shipment1',
    },
  };
  const item = {
    name: 'item1',
    quantity: 400,
    serial: 'item324234',
    productProvider: {
      supplier: {
        name: 'supplier1',
      },
    },
    batches: [batch, batch, batch, batch, batch, batch, batch],
  };
  const items = [item, item, item];
  return <ProductFocused items={items} />;
});
