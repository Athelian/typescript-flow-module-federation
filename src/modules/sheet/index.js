// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import OrderSheetModule from './orders';

const SheetApp = () => (
  <Router>
    <OrderSheetModule path="/order" />
  </Router>
);

export default SheetApp;
