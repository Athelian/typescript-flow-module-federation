// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar, SearchInput } from 'components/NavBar';
import { ExportButton } from 'components/Buttons';
import { Sheet, ColumnsConfig } from 'components/Sheet';
import type { ColumnConfig, ColumnSort, SortDirection } from 'components/Sheet';
import Filter from 'components/NavBar/components/Filter';
import { OrderConfigFilter } from 'components/NavBar/components/Filter/configs';
import { clone } from 'utils/fp';
import { isEnableBetaFeature } from 'utils/env';
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
  const [filterBy, setFilterBy] = React.useState<{ [string]: any }>({
    query: '',
    archived: false,
  });
  const [sortBy, setSortBy] = React.useState<{ [string]: 'ASCENDING' | 'DESCENDING' }>({
    updatedAt: 'DESCENDING',
  });
  const [localSortBy, setLocalSortBy] = React.useState<
    Array<{ field: string, direction: SortDirection }>
  >([]);
  const sorterProxy = React.useCallback(
    (items: Array<Object>, sorts: Array<ColumnSort>): Array<Object> => {
      setLocalSortBy(
        sorts.map(s => ({
          field: `${s.group}_${s.name}`,
          direction: s.direction,
        }))
      );

      return sorter(items, sorts);
    },
    [setLocalSortBy]
  );

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
        setPage({ page: 1, totalPage: data?.orders?.totalPage ?? 1 });
        setInitialOrders(clone(data?.orders?.nodes ?? []));
        setLoading(false);
      });
  }, [client, filterBy, sortBy]);

  const { query, ...filters } = filterBy;

  console.warn({
    orderIds,
  });

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="SHEET" color="SHEET" />

        <Filter
          config={OrderConfigFilter}
          filters={filters}
          onChange={value =>
            setFilterBy({
              ...value,
              query,
            })
          }
        />
        <SearchInput
          value={query}
          name="search"
          onClear={() =>
            setFilterBy({
              ...filterBy,
              query: '',
            })
          }
          onChange={value =>
            setFilterBy({
              ...filterBy,
              query: value,
            })
          }
        />
        <ColumnsConfig columns={columns} onChange={setCurrentColumns} />
        {isEnableBetaFeature && (
          <ExportButton
            type="Orders"
            exportQuery={ordersExportQuery}
            variables={{
              filterBy,
              sortBy,
              localSortBy,
              columns: currentColumns.filter(c => !!c.exportKey).map(c => c.exportKey),
            }}
          />
        )}
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
              variables: { page: page.page + 1, perPage: 20, filterBy, sortBy },
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
