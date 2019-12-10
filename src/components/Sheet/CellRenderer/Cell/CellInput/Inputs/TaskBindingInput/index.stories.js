/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TaskBindingInput from './index';

storiesOf('GTV/Inputs', module)
  .add('TaskBindingInput with no binding', () => (
    <TaskBindingInput
      onChange={action('change')}
      onBlur={action('blur')}
      onFocus={action('focus')}
      value={{
        parentEntity: 'Order',
        type: 'startDate',
        date: new Date().toDateString(),
      }}
    />
  ))
  .add('TaskBindingInput with binding date', () => (
    <TaskBindingInput
      onChange={action('change')}
      onBlur={action('blur')}
      onFocus={action('focus')}
      value={{
        parentEntity: 'Order',
        binding: 'OrderIssuedAt',
        type: 'startDate',
        interval: {
          months: 4,
        },
        date: new Date().toDateString(),
      }}
    />
  ))

  .add('TaskBindingInput in readonly', () => (
    <TaskBindingInput
      onChange={action('change')}
      onBlur={action('blur')}
      onFocus={action('focus')}
      readonly
      value={{
        parentEntity: 'Order',
        type: 'startDate',
        date: new Date().toDateString(),
      }}
    />
  ))
  .add('TaskBindingInput with binding date in readonly', () => (
    <TaskBindingInput
      onChange={action('change')}
      onBlur={action('blur')}
      onFocus={action('focus')}
      readonly
      value={{
        parentEntity: 'Order',
        binding: 'OrderIssuedAt',
        type: 'startDate',
        interval: {
          months: 4,
        },
        date: new Date().toDateString(),
      }}
    />
  ));
