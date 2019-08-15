// @flow
import React from 'react';
import { Query } from 'react-apollo';
import { Content } from 'components/Layout';
import { NavBar } from 'components/NavBar';
import { getByPathWithDefault } from 'utils/fp';

import { ordersInGlobalViewQuery } from './query';
import { transferOrder } from './helper';
import Table from './Table';

const initialVariables = {
  page: 1,
  perPage: 10,
  sortBy: {},
  filterBy: {},
};

const GlobalView = () => {
  return (
    <>
      <NavBar>Menu</NavBar>
      <Content>
        <Query query={ordersInGlobalViewQuery} variables={initialVariables}>
          {({ error, data }) => {
            if (error) {
              return error.message;
            }

            // const nextPage = getByPathWithDefault(1, 'orders.page', data) + 1;
            // const totalPage = getByPathWithDefault(1, 'orders.totalPage', data);
            // const hasMore = nextPage <= totalPage;

            const orders = getByPathWithDefault([], 'orders.nodes', data);

            const keys = [
              'order name',
              'order others',
              'item name',
              'item others',
              'batch name',
              'batch others',
              'container name',
              'container others',
              'shipment name',
              'shipment others',
            ];
            const columnWidths = Array(keys.length).fill(200);

            const tableData = orders.forEach(order => {
              return transferOrder(order);
            });

            return <Table columnWidths={columnWidths} keys={keys} data={tableData} />;
          }}
        </Query>
      </Content>
    </>
  );
};

export default GlobalView;
