import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action
import { action } from '@storybook/addon-actions';

import { DefaultStyle, DateTimeInput } from './index';

storiesOf('Form/Inputs', module)
  .add('DateTimeInput empty value', () => (
    <DefaultStyle type="date" align="left" width="200px">
      <DateTimeInput onChange={action('onChange')} />
    </DefaultStyle>
  ))
  .add('DateTimeInput', () => (
    <DefaultStyle type="date" align="left" width="200px">
      <DateTimeInput value="2019-01-16T13:59" onChange={action('onChange')} />
    </DefaultStyle>
  ));
