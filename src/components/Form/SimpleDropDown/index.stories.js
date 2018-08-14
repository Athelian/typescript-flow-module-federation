/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DropDown from './index';

storiesOf('Form/SimpleDropDown', module)
  .add('with label', () => (
    <form onSubmit={action('onSubmit')}>
      <DropDown
        required
        name="qty"
        placeholder="Please select the quantity"
        label="Qty"
        onChange={action('onChange')}
        onBlur={action('onBlur')}
        value="one"
        options={[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }]}
        permissions="rw"
      />
    </form>
  ))
  .add('with select input style', () => (
    <form onSubmit={action('onSubmit')}>
      <DropDown
        required
        editable
        name="qty"
        placeholder="Please select the quantity"
        label="Qty"
        onChange={action('onChange')}
        onBlur={action('onBlur')}
        value="one"
        options={[{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }]}
        permissions="rw"
      />
    </form>
  ))
  .add('with selected value', () => (
    <form onSubmit={action('submit')}>
      <DropDown
        required
        label="Quantity"
        name="qty"
        placeholder="Please select the quantity"
        onChange={action('onChange')}
        onBlur={action('onBlur')}
        value="one"
        options={[
          { value: '1', label: 'One' },
          { value: '2', label: 'Two' },
          { value: '3', label: 'Three' },
          { value: '4', label: 'Four' },
        ]}
        permissions="rw"
      />
    </form>
  ))
  .add('readonly', () => (
    <form onSubmit={action('onSubmit')}>
      <DropDown
        required
        label="Quantity"
        name="qty"
        placeholder="Please select the quantity"
        value={1}
        options={[
          { value: '1', label: 'One' },
          { value: '2', label: 'Two' },
          { value: '3', label: 'Three' },
          { value: '4', label: 'Four' },
        ]}
        permissions="r"
      />
    </form>
  ))
  .add('no permission', () => (
    <form onSubmit={action('onSubmit')}>
      <DropDown
        required
        label="Quantity"
        name="qty"
        placeholder="Please select the quantity"
        value={1}
        options={[
          { value: '1', label: 'One' },
          { value: '2', label: 'Two' },
          { value: '3', label: 'Three' },
          { value: '4', label: 'Four' },
        ]}
        permissions=""
      />
    </form>
  ));
