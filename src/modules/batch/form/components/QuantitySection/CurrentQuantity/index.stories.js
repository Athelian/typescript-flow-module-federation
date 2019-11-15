/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import CurrentQuantity from './index';

storiesOf('CurrentQuantity', module).add('with isCurrentQuantity', () => (
  <CurrentQuantity isCurrentQuantity>
    <input
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
        borderRadius: '5px',
      }}
    />
  </CurrentQuantity>
));
