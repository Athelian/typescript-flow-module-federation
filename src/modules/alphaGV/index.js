// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import AlphaGVOrdersModule from './index.orders';

const AlphaGVApp = () => (
  <Router>
    <AlphaGVOrdersModule path="/" />
  </Router>
);

export default AlphaGVApp;
