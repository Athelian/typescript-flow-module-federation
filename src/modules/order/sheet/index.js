// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar, Search, Filter, OrderFilterConfig } from 'components/NavBar';
import { ExportButton } from 'components/Buttons';
import { Sheet, ColumnsConfig } from 'components/Sheet';
import type { ColumnConfig, ColumnSort } from 'components/Sheet';
import useFilterSort from 'hooks/useFilterSort';
import { clone } from 'utils/fp';
import type { SortDirection } from 'types';
import { ordersExportQuery } from '../query';
import columns from './columns';
import transformer from './transformer';
import entityEventHandler from './handler';
import sorter from './sorter';
import mutate from './mutate';
import { ordersQuery } from './query';

type Props = {
  orderIds?: Array<string>,
};

const OrderSheetModule = ({ orderIds }: Props) => {
  const client = useApolloClient();
  const [currentColumns, setCurrentColumns] = React.useState<Array<ColumnConfig>>(columns);
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

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    orderIds ? { query: '', ids: orderIds } : { query: '', archived: false },
    { updatedAt: 'DESCENDING' }
  );
  const [localSortBy, setLocalSortBy] = React.useState<
    Array<{ field: string, direction: SortDirection }>
  >([]);
  const sorterProxy = React.useCallback(
    (items: Array<Object>, sorts: Array<ColumnSort>): Array<Object> => {
      setLocalSortBy(
        sorts.map(({ group, name, direction }: any) => ({
          direction,
          field: `${group}_${name}`,
        }))
      );

      return sorter(items, sorts);
    },
    [setLocalSortBy]
  );

  React.useEffect(() => {
    let cancel = false;

    setLoading(true);
    setInitialOrders([]);
    setPage({ page: 1, totalPage: 1 });

    client
      .query({
        query: ordersQuery,
        variables: { page: 1, perPage: 20, filterBy: { query, ...filterBy }, sortBy },
      })
      .then(({ data }) => {
        if (cancel) {
          return;
        }

        setPage({ page: 1, totalPage: data?.orders?.totalPage ?? 1 });
        setInitialOrders(clone(data?.orders?.nodes ?? []));
        setLoading(false);
      });

    return () => {
      cancel = true;
    };
  }, [client, query, filterBy, sortBy]);

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="ORDER" color="ORDER" subIcon="TABLE" />

        <Filter config={OrderFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <ColumnsConfig columns={columns} onChange={setCurrentColumns} />
        <ExportButton
          type="Orders"
          exportQuery={ordersExportQuery}
          variables={{
            filterBy: { query, ...filterBy },
            sortBy,
            localSortBy,
            columns: currentColumns.filter(c => !!c.exportKey).map(c => c.exportKey),
          }}
        />
      </NavBar>

      <Sheet
        columns={currentColumns}
        loading={loading}
        items={initialOrders}
        hasMore={page.page < page.totalPage}
        transformItem={transformer}
        onMutate={memoizedMutate}
        handleEntityEvent={memoizedHandler}
        onLocalSort={sorterProxy}
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
              variables: {
                page: page.page + 1,
                perPage: 20,
                filterBy: { query, ...filterBy },
                sortBy,
              },
            })
            .then(({ data }) => {
              setPage({
                ...page,
                page: page.page + 1,
              });
              return clone(data?.orders?.nodes ?? []);
            })
        }
      />
    </Content>
  );
};

export default OrderSheetModule;
