// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import OrderList from './list';

const Order = () => (
  <UIConsumer>
    {uiState => (
      <Layout {...uiState}>
        <OrderList />
      </Layout>
    )}
  </UIConsumer>
);

export default Order;
