/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import BatchCard from './index';

storiesOf('RelationMapV2', module).add('BatchCard', () => (
  <BatchCard no="Item no" onCreateBatch={action('create a batch')} />
));
