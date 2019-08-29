// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { getByPathWithDefault } from 'utils/fp';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar } from 'components/NavBar';
import { Sheet } from 'components/Sheet';
import columns from './columns';
import transformer from './transformer';
import mutate from './mutate';
import { orderSheetQuery } from './query';

const OrderSheetModule = () => {
  const client = useApolloClient();
  const memoizedMutate = React.useCallback(mutate(client), [client]);

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
        query: orderSheetQuery,
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

      <Sheet
        columns={columns}
        loading={loading}
        items={initialOrders}
        hasMore={page.page < page.totalPage}
        transformItem={transformer}
        onMutate={memoizedMutate}
        onLoadMore={() =>
          client
            .query({
              query: orderSheetQuery,
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

export default OrderSheetModule;
