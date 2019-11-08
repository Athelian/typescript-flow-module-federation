// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import type { FilterBy, SortBy, SortDirection } from 'types';
import useFilterSort from 'hooks/useFilterSort';
import type { ColumnConfig, ColumnSort } from './SheetState/types';
import useLocalSort from './useLocalSort';
import useColumns from './useColumns';

type Input = {
  columns: Array<ColumnConfig>,
  itemsQuery: DocumentNode,
  initialFilterBy: FilterBy,
  initialSortBy: SortBy,
  cacheKey: string,
  sorter: (items: Array<Object>, sorts: Array<ColumnSort>) => Array<Object>,
  getItems: (data: Object) => { page: number, totalPage: number, nodes: Array<Object> },
};

type Output = {
  initialItems: Array<Object>,
  loading: boolean,
  hasMore: boolean,
  columns: Array<ColumnConfig>,
  setColumns: (Array<ColumnConfig>) => void,
  query: string,
  setQuery: string => void,
  filterBy: FilterBy,
  setFilterBy: FilterBy => void,
  sortBy: SortBy,
  setSortBy: SortBy => void,
  localSortBy: Array<{ field: string, direction: SortDirection }>,
  onRemoteSort: (sorts: Array<ColumnSort>) => void,
  onLocalSort: (items: Array<Object>, sorts: Array<ColumnSort>) => Array<Object>,
  onLoadMore: () => Promise<Array<Object>>,
};

export default function useSheet({
  columns,
  itemsQuery,
  initialFilterBy,
  initialSortBy,
  cacheKey,
  sorter,
  getItems,
}: Input): Output {
  const client = useApolloClient();

  const [currentColumns, setCurrentColumns] = useColumns(columns, cacheKey);
  const [initialItems, setInitialItems] = React.useState<Array<Object>>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<{ page: number, totalPage: number }>({
    page: 1,
    totalPage: 1,
  });

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    initialFilterBy,
    initialSortBy,
    cacheKey
  );
  const [localSortBy, setLocalSortBy] = useLocalSort(cacheKey);
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
    [sorter, setLocalSortBy]
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
          query: itemsQuery,
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
          const { nodes } = getItems(data);
          return nodes;
        }),
    [client, page, query, filterBy, sortBy, setPage, itemsQuery, getItems]
  );

  React.useEffect(() => {
    setLoading(true);
    setInitialItems([]);
    setPage({ page: 1, totalPage: 1 });

    const watchedQuery = client
      .watchQuery({
        query: itemsQuery,
        variables: { page: 1, perPage: 20, filterBy: { query, ...filterBy }, sortBy },
      })
      .subscribe(({ data }: { data: Object }) => {
        const { totalPage, nodes } = getItems(data);

        setPage({ page: 1, totalPage });
        setInitialItems(nodes);
        setLoading(false);
      });

    return () => watchedQuery.unsubscribe();
  }, [client, query, filterBy, sortBy, itemsQuery, getItems]);

  return {
    initialItems,
    loading,
    hasMore: page.page < page.totalPage,
    columns: currentColumns,
    setColumns: setCurrentColumns,
    query,
    setQuery,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    localSortBy,
    onLocalSort,
    onRemoteSort,
    onLoadMore,
  };
}
