/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import NumberInput from './index';

storiesOf('Form/NumberInput', module)
  .add('with label', () => (
    <form onSubmit={action('submit')}>
      <NumberInput
        required
        name="qty"
        label="Qty"
        onChange={action('onChange')}
        onBlur={action('onBlur')}
        value={10}
        permissions="rw"
      />
    </form>
  ))
  .add('readonly', () => (
    <form onSubmit={action('onSubmit')}>
      <NumberInput label="Age" value={30} permissions="r" />
    </form>
  ))
  .add('support formatter', () => (
    <form onSubmit={action('onSubmit')}>
      <NumberInput
        required
        name="price"
        label="Price"
        onChange={action('onChange')}
        onBlur={action('onBlur')}
        value={10000}
        formatter={value =>
          new Intl.NumberFormat('en', {
            style: 'currency',
            currency: 'USD',
          }).format(value)
        }
        permissions="rw"
      />
    </form>
  ));
