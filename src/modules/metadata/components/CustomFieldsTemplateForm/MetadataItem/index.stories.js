// @flow
import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';

import MetadataItem from './index';

storiesOf('MetadataItem', module).add('default', () => (
  <div
    style={{
      marginLeft: 50,
      marginTop: 50,
      width: 330,
      height: 200,
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      gridGap: '40px',
    }}
  >
    <MetadataItem
      value={{
        checked: true,
        key: 'METADATA A',
        value: 'Input',
      }}
    />
    <MetadataItem
      value={{
        checked: false,
        key: 'METADATA 2',
        value: 'Input',
      }}
    />
  </div>
));
