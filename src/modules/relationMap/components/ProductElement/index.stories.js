/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import ProductCard from './ProductCard';
import BatchCard from './BatchCard';
import * as style from './style';

storiesOf('RelationMap/ProductFocused', module)
  .add('ProductCard', () => {
    const item = {
      name: 'ProductName',
      serial: 'RER32423432',
      quantity: 800,
      productProvider: {
        supplier: {
          name: 'export er32',
        },
      },
      tags: [
        {
          id: '234234',
          name: 'some tag',
          color: 'red',
        },
      ],
      batches: [
        {
          quantity: 300,
        },
      ],
    };
    return (
      <IntlProvider locale="en" messages={translationMessages.en}>
        <ProductCard item={item} />
      </IntlProvider>
    );
  })
  .add('BatchCard', () => {
    const item = {
      tags: [
        {
          id: '234234',
          name: 'some tag',
          color: 'red',
        },
      ],
    };
    return (
      <IntlProvider locale="en" messages={translationMessages.en}>
        <BatchCard item={item} />
      </IntlProvider>
    );
  })
  .add('BatchList', () => {
    const item = {
      tags: [
        {
          id: '234234',
          name: 'some tag',
          color: 'red',
        },
      ],
    };
    return (
      <IntlProvider locale="en" messages={translationMessages.en}>
        <div className={style.BatchListWrapperStyle}>
          <BatchCard item={item} />
          <BatchCard item={item} />
          <BatchCard item={item} />
          <BatchCard item={item} />
          <BatchCard item={item} />
          <BatchCard item={item} />
          <BatchCard item={item} />
          <BatchCard item={item} />
        </div>
      </IntlProvider>
    );
  });
