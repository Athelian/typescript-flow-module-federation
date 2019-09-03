/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import OrderItemCard from './index';

storiesOf('RelationMapV2', module).add('OrderItemCard', () => (
  <OrderItemCard no="Item no" onCreateBatch={action('create a batch')} />
));
