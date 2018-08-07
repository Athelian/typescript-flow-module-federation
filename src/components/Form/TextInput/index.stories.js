/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TextInput from './index';

storiesOf('Form/TextInput', module)
  .add('with label', () => (
    <form onSubmit={action('submit')}>
      <TextInput
        required
        label="Email:"
        type="email"
        name="email"
        onChange={action('onChange')}
        onBlur={action('onBlur')}
        permissions="rw"
      />
    </form>
  ))
  .add('with info tooltip', () => (
    <form onSubmit={action('submit')}>
      <TextInput
        required
        label="Email:"
        type="email"
        name="email"
        infoMessage="E.g: test@email.com"
        onChange={action('onChange')}
        onBlur={action('onBlur')}
        permissions="rw"
      />
    </form>
  ))
  .add('readonly', () => (
    <form onSubmit={action('onSubmit')}>
      <TextInput type="email" name="email" value="example@email.com" permissions="r" />
    </form>
  ))
  .add('no permission', () => (
    <form onSubmit={action('onSubmit')}>
      <TextInput permissions="" />
    </form>
  ));
