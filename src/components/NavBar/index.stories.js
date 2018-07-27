import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import NavBar from './index';

storiesOf('Navbar', module).add('title', () => (
  <div style={{ height: '2000px' }}>
    <NavBar>
      <div>Left </div>
      <div>Right</div>
    </NavBar>

    <div style={{ marginTop: '500px' }}>Content</div>
  </div>
));
