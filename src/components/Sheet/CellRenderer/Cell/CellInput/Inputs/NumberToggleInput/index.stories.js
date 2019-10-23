/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import NumberToggleInput from './index';

storiesOf('GTV/Inputs', module)
  .add('NumberToggleInput with default props', () => (
    <NumberToggleInput
      onToggle={action('toggle')}
      onChange={action('change')}
      onBlur={action('blur')}
      onFocus={action('focus')}
      value={[false, 0]}
    />
  ))
  .add('NumberToggleInput with read only', () => (
    <NumberToggleInput
      onToggle={action('toggle')}
      onChange={action('change')}
      onBlur={action('blur')}
      onFocus={action('focus')}
      readOnly
      value={[true, 3]}
    />
  ))
  .add('NumberToggleInput with enable toggle', () => (
    <NumberToggleInput
      onToggle={action('toggle')}
      onChange={action('change')}
      onBlur={action('blur')}
      onFocus={action('focus')}
      value={[false, 0]}
    />
  ));
