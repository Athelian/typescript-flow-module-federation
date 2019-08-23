// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar } from 'components/NavBar';
import { Table } from 'components/Table';
import { transformer } from './transformer';
import { ordersGlobalViewQuery } from './query';
import { getByPathWithDefault } from '../../utils/fp';

const columnsConfig = [
  {
    key: 'order.poNo',
    title: 'PO No',
    width: 200,
  },
  {
    key: 'order.currency',
    title: 'Currency',
    width: 200,
  },
  {
    key: 'order.orderItem.no',
    title: 'Item No',
    width: 200,
  },
  {
    key: 'order.orderItem.quantity',
    title: 'Quantity',
    width: 200,
  },
  {
    key: 'order.orderItem.batch.no',
    title: 'Batch No',
    width: 200,
  },
  {
    key: 'order.orderItem.batch.quantity',
    title: 'Quantity',
    width: 200,
  },
  {
    key: 'order.orderItem.batch.container.no',
    title: 'Container No',
    width: 200,
  },
  {
    key: 'order.orderItem.batch.shipment.no',
    title: 'Shipment No',
    width: 200,
  },
];

const AlphaGVOrdersModule = () => {
  const client = useApolloClient();

  const [initialOrders, setInitialOrders] = React.useState<Object>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<{ page: number, totalPage: number }>({
    page: 1,
    totalPage: 1,
  });

  React.useEffect(() => {
    setLoading(true);

    client
      .query({
        query: ordersGlobalViewQuery,
        variables: { page: 1, perPage: 20, filterBy: {}, sortBy: {} },
      })
      .then(({ data }) => {
        setLoading(false);
        setPage({ page: 1, totalPage: getByPathWithDefault(1, 'orders.totalPage', data) });
        setInitialOrders(getByPathWithDefault([], 'orders.nodes', data));
      });
  }, [client]);

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="SHEET" color="SHEET" />
      </NavBar>

      <Table
        columns={columnsConfig}
        loading={loading}
        items={initialOrders}
        hasMore={page.page < page.totalPage}
        transformItem={transformer}
        onLoadMore={() =>
          client
            .query({
              query: ordersGlobalViewQuery,
              variables: { page: page.page + 1, perPage: 20, filterBy: {}, sortBy: {} },
            })
            .then(({ data }) => {
              setPage({
                ...page,
                page: page.page + 1,
              });
              return getByPathWithDefault([], 'orders.nodes', data);
            })
        }
      />
    </Content>
  );
};

export default AlphaGVOrdersModule;
