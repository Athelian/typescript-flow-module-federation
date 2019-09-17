// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar } from 'components/NavBar';
import { Sheet, ColumnsConfig } from 'components/Sheet';
import Filter from 'components/Filter';
import { clone } from 'utils/fp';
import columns from './columns';
import transformer from './transformer';
import entityEventHandler from './handler';
import sorter from './sorter';
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
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<{ page: number, totalPage: number }>({
    page: 1,
    totalPage: 1,
  });
  const [filterBy, setFilterBy] = React.useState<{ [string]: any }>({
    archived: false,
  });
  const [sortBy, setSortBy] = React.useState<{ [string]: 'ASCENDING' | 'DESCENDING' }>({
    updatedAt: 'DESCENDING',
  });

  React.useEffect(() => {
    setLoading(true);
    setInitialOrders([]);
    setPage({ page: 1, totalPage: 1 });

    client
      .query({
        query: ordersQuery,
        variables: { page: 1, perPage: 20, filterBy, sortBy },
      })
      .then(({ data }) => {
        setPage({ page: 1, totalPage: data.orders?.totalPage ?? 1 });
        setInitialOrders(clone(data.orders?.nodes ?? []));
        setLoading(false);
      });
  }, [client, filterBy, sortBy]);

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="SHEET" color="SHEET" />

        <Filter
          config={[{ entity: 'ORDER', field: 'archived', type: 'archived', defaultValue: false }]}
          filters={filterBy}
          onChange={setFilterBy}
        />
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
        onLocalSort={sorter}
        onRemoteSort={sorts =>
          setSortBy(
            sorts.reduce((remote, sort) => {
              return {
                ...remote,
                [sort.name]: sort.direction,
              };
            }, {})
          )
        }
        onLoadMore={() =>
          client
            .query({
              query: ordersQuery,
              variables: { page: page.page + 1, perPage: 20, filterBy, sortBy },
            })
            .then(({ data }) => {
              setPage({
                ...page,
                page: page.page + 1,
              });
              return clone(data.orders?.nodes ?? []);
            })
        }
      />
    </Content>
  );
};

export default OrderSheetModule;
