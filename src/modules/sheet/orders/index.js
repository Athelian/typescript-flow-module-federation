// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar } from 'components/NavBar';
import { Sheet, ColumnsConfig } from 'components/Sheet';
import columns from './columns';
import transformer from './transformer';
import entityEventHandler from './handler';
import mutate from './mutate';
import { ordersQuery } from './query';

const OrderSheetModule = () => {
  const client = useApolloClient();
  const [currentColumns, setCurrentColumns] = React.useState(columns);
  const memoizedMutate = React.useCallback(mutate(client), [client]);
  const memoizedHandler = React.useCallback(dispatch => entityEventHandler(client, dispatch), [
    client,
  ]);

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
        query: ordersQuery,
        variables: { page: 1, perPage: 20, filterBy: {}, sortBy: {} },
      })
      .then(({ data }) => {
        setLoading(false);
        setPage({ page: 1, totalPage: data.orders?.totalPage ?? 1 });
        setInitialOrders(data.orders?.nodes ?? []);
      });
  }, [client]);

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="SHEET" color="SHEET" />

        <ColumnsConfig columns={columns} onChange={setCurrentColumns} />
      </NavBar>

      <Sheet
        columns={currentColumns}
        loading={loading}
        items={initialOrders}
        hasMore={page.page < page.totalPage}
        transformItem={transformer}
        onMutate={memoizedMutate}
        handleEntityEvent={memoizedHandler}
        onLoadMore={() =>
          client
            .query({
              query: ordersQuery,
              variables: { page: page.page + 1, perPage: 20, filterBy: {}, sortBy: {} },
            })
            .then(({ data }) => {
              setPage({
                ...page,
                page: page.page + 1,
              });
              return data.orders?.nodes ?? [];
            })
        }
      />
    </Content>
  );
};

export default OrderSheetModule;
