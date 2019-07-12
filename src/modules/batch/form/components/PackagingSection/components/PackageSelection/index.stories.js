/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import faker from 'faker';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PackageSelection from './index';

storiesOf('PackageSelection', module).add('with selected value', () => (
  <PackageSelection
    defaultPackaging={{
      id: 1,
    }}
    items={[
      {
        id: 1,
        name: '',
      },
      {
        id: 2,
        name: faker.name.findName(),
      },
      {
        id: 3,
        name: faker.name.findName(),
      },
    ]}
    onApply={action('onApply')}
    onClose={action('onClose')}
  />
));
