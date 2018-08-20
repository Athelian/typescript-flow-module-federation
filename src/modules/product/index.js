// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import ProductListContainer from './index.list';
import ProductFormContainer from './index.form';

const ProductApp = () => (
  <Router>
    <ProductListContainer path="/" />
    <ProductFormContainer path=":productId" />
  </Router>
);

export default ProductApp;
