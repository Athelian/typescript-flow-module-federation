/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import IncrementInput from 'components/IncrementInput';

storiesOf('IncrementInput', module)
  .add('default', () => (
    <div style={{ height: 200, width: 200 }}>
      <IncrementInput value={0} onChange={action('onChange')} />
    </div>
  ))
  .add('num = 9', () => (
    <div style={{ height: 200, width: 200 }}>
      <IncrementInput value={9} onChange={action('onChange')} />
    </div>
  ));
