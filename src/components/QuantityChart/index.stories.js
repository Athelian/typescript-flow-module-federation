/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import { storiesOf } from '@storybook/react';
import QuantityChart from './index';

storiesOf('Chart/QuantityChart', module)
  .add('en label', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <div style={{ marginTop: '50px', width: '200px' }}>
        <QuantityChart orderedQuantity={500} batchedQuantity={500} shippedQuantity={250} hasLabel />
      </div>
    </IntlProvider>
  ))
  .add('ja label', () => (
    <IntlProvider locale="ja" messages={translationMessages.ja} textComponent={React.Fragment}>
      <div style={{ marginTop: '50px', width: '200px' }}>
        <QuantityChart orderedQuantity={500} batchedQuantity={300} shippedQuantity={400} hasLabel />
      </div>
    </IntlProvider>
  ))
  .add('all are 0', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <div style={{ marginTop: '50px', width: '200px' }}>
        <QuantityChart orderedQuantity={0} batchedQuantity={0} shippedQuantity={0} hasLabel />
      </div>
    </IntlProvider>
  ))
  .add('count at center', () => (
    <IntlProvider locale="ja" messages={translationMessages.ja} textComponent={React.Fragment}>
      <div style={{ marginTop: '50px', width: '200px' }}>
        <QuantityChart
          orderedQuantity={500}
          batchedQuantity={500}
          shippedQuantity={250}
          batched={4}
          shipped={2}
        />
      </div>
    </IntlProvider>
  ));
