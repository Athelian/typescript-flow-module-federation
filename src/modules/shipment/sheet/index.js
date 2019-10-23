// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { Content } from 'components/Layout';
import { EntityIcon, NavBar, Search, Filter, ShipmentFilterConfig } from 'components/NavBar';
import { ExportButton } from 'components/Buttons';
import { Sheet, ColumnsConfig } from 'components/Sheet';
import type { ColumnConfig, ColumnSort } from 'components/Sheet';
import useFilterSort from 'hooks/useFilterSort';
import { clone } from 'utils/fp';
import type { SortDirection } from 'types';
import { shipmentsExportQuery } from '../query';
import columns from './columns';
import transformer from './transformer';
import entityEventHandler from './handler';
import sorter from './sorter';
import mutate from './mutate';
import { shipmentsQuery } from './query';

type Props = {
  shipmentIds?: Array<string>,
};

const ShipmentSheetModule = ({ shipmentIds }: Props) => {
  const client = useApolloClient();
  const [currentColumns, setCurrentColumns] = React.useState<Array<ColumnConfig>>(columns);
  const memoizedMutate = React.useCallback(mutate(client), [client]);
  const memoizedHandler = React.useCallback(dispatch => entityEventHandler(client, dispatch), [
    client,
  ]);

  const [initialShipments, setInitialShipments] = React.useState<Object>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<{ page: number, totalPage: number }>({
    page: 1,
    totalPage: 1,
  });

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    shipmentIds ? { query: '', ids: shipmentIds } : { query: '', archived: false },
    { updatedAt: 'DESCENDING' }
  );
  const [localSortBy, setLocalSortBy] = React.useState<
    Array<{ field: string, direction: SortDirection }>
  >([]);
  const onLocalSort = React.useCallback(
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
  const onRemoteSort = React.useCallback(
    sorts =>
      setSortBy(
        sorts.reduce((remote, sort) => {
          return {
            ...remote,
            [sort.name]: sort.direction,
          };
        }, {})
      ),
    [setSortBy]
  );

  const onLoadMore = React.useCallback(
    () =>
      client
        .query({
          query: shipmentsQuery,
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
          return clone(data?.shipments?.nodes ?? []);
        }),
    [client, page, query, filterBy, sortBy, setPage]
  );

  React.useEffect(() => {
    let cancel = false;

    setLoading(true);
    setInitialShipments([]);
    setPage({ page: 1, totalPage: 1 });

    client
      .query({
        query: shipmentsQuery,
        variables: { page: 1, perPage: 20, filterBy: { query, ...filterBy }, sortBy },
      })
      .then(({ data }) => {
        if (cancel) {
          return;
        }

        setPage({ page: 1, totalPage: data?.shipments?.totalPage ?? 1 });
        setInitialShipments(clone(data?.shipments?.nodes ?? []));
        setLoading(false);
      });

    return () => {
      cancel = true;
    };
  }, [client, query, filterBy, sortBy]);

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="SHIPMENT" color="SHIPMENT" subIcon="TABLE" />

        <Filter config={ShipmentFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <ColumnsConfig columns={columns} onChange={setCurrentColumns} />
        <ExportButton
          type="Shipments"
          exportQuery={shipmentsExportQuery}
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
        items={initialShipments}
        hasMore={page.page < page.totalPage}
        transformItem={transformer}
        onMutate={memoizedMutate}
        handleEntityEvent={memoizedHandler}
        onLocalSort={onLocalSort}
        onRemoteSort={onRemoteSort}
        onLoadMore={onLoadMore}
      />
    </Content>
  );
};

export default ShipmentSheetModule;
