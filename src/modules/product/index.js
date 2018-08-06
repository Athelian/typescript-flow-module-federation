// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';

const Product = () => (
  <UIConsumer>
    {uiState => (
      <Layout {...uiState}>
        <div> Product </div>
      </Layout>
    )}
  </UIConsumer>
);

export default Product;
