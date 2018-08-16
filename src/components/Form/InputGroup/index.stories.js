import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import TextInput from 'components/TextInput';
import InputGroup from './index';

storiesOf('InputGroup', module)
  .add('Row Direction', () => (
    <InputGroup>
      <TextInput />
      <TextInput />
      <TextInput />
    </InputGroup>
  ))
  .add('Column Direction', () => (
    <InputGroup direction="column">
      <TextInput />
      <TextInput />
      <TextInput />
    </InputGroup>
  ));
