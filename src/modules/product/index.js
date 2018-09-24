// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import ProductListModule from './index.list';
import ProductFormModule from './index.form';

const ProductApp = () => (
  <Router>
    <ProductListModule path="/" />
    <ProductFormModule path=":productId" />
  </Router>
);

export default ProductApp;
