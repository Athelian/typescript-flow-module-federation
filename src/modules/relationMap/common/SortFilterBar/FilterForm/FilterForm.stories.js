/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'unstated';
import FilterForm from './index';

storiesOf('RelationMap/FilterForm', module).add('Filter', () => (
  <Provider>
    <FilterForm />
  </Provider>
));
