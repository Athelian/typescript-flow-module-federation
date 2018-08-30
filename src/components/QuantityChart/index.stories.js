/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import QuantityChart from './index';

storiesOf('QuantityChart', module)
  .add('styling 1', () => (
    <div style={{ marginTop: '50px', width: '200px' }}>
      <QuantityChart orderedQuantity={500} batchedQuantity={500} shippedQuantity={250} hasLabel />
    </div>
  ))
  .add('styling 2', () => (
    <div style={{ marginTop: '50px', width: '200px' }}>
      <QuantityChart
        orderedQuantity={500}
        batchedQuantity={500}
        shippedQuantity={250}
        numBatched={4}
        numShipped={2}
      />
    </div>
  ));
