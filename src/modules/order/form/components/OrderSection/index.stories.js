/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import OrderSection from './index';

storiesOf('Order Form/OrderSection', module)
  .add('new state', () => (
    <React.Fragment>
      <div id="slide-view-root" />
      <OrderSection isNew />
    </React.Fragment>
  ))
  .add('view/edit state', () => (
    <React.Fragment>
      <div id="slide-view-root" />
      <OrderSection />
    </React.Fragment>
  ));
