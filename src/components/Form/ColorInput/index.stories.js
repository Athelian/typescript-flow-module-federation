/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ColorInput from 'components/Form/ColorInput/index';

storiesOf('ColorInput', module).add('default', () => (
  <div style={{ height: 200, width: 500 }}>
    <ColorInput name="color" value="#ea9081" onChange={action('onChange')} />
  </div>
));
