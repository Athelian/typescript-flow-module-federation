/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import OrderCard from './index';

storiesOf('RelationMapV2', module).add('OrderCard', () => (
  <OrderCard poNo="no 1" onCreateBatch={action('create a batch')} />
));
