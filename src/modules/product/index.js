// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { Router, Redirect } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { NAVIGATION_PRODUCTS_LIST } from 'modules/permission/constants/navigation';
import { PRODUCT_CREATE } from 'modules/permission/constants/product';
import ProductListModule from './index.list';
import ProductFormModule from './index.form';

const ProductFormModuleWrapper = withNotFound(ProductFormModule, 'productId');
const ProductFormModuleCreationWrapper = withForbidden(ProductFormModuleWrapper, PRODUCT_CREATE);
const ProductModuleListWrapper = withForbidden(ProductListModule, NAVIGATION_PRODUCTS_LIST);

const ProductApp = () => (
  <Provider>
    <Router>
      {/* $FlowFixMe Flow typed is not updated yet */}
      <Redirect path="/" from="/" to="/product/cards" noThrow />
      <ProductModuleListWrapper path="/cards" />
      <ProductFormModuleCreationWrapper path="new" />
      <ProductFormModuleCreationWrapper path="clone/:productId" />
      <ProductFormModuleWrapper path=":productId" />
    </Router>
  </Provider>
);

export default ProductApp;
