// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { PRODUCT_CREATE, PRODUCT_GET, PRODUCT_LIST } from 'modules/permission/constants/product';
import ProductListModule from './index.list';
import ProductFormModule from './index.form';

const ProductFormModuleWrapper = withNotFound(ProductFormModule, 'productId');
const ProductFormModuleDetailWrapper = withForbidden(ProductFormModuleWrapper, PRODUCT_GET);
const ProductFormModuleCreationWrapper = withForbidden(ProductFormModuleWrapper, PRODUCT_CREATE);
const ProductModuleListWrapper = withForbidden(ProductListModule, PRODUCT_LIST);

const ProductApp = () => (
  <Router>
    <ProductModuleListWrapper path="/" />
    <ProductFormModuleCreationWrapper path="new" />
    <ProductFormModuleCreationWrapper path="clone/:productId" />
    <ProductFormModuleDetailWrapper path=":productId" />
  </Router>
);

export default ProductApp;
