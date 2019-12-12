// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import type { FilterBy, SortBy } from 'types';
import useFilterSort from 'hooks/useFilterSort';

type Input = {
  itemsQuery: DocumentNode,
  initialFilterBy: FilterBy,
  initialSortBy: SortBy,
  cacheKey: string,
  getItems: (data: Object) => { page: number, totalPage: number, nodes: Array<Object> },
};

type Output = {
  initialItems: Array<Object>,
  loading: boolean,
  hasMore: boolean,
  query: string,
  setQuery: string => void,
  filterBy: FilterBy,
  setFilterBy: FilterBy => void,
  sortBy: SortBy,
  setSortBy: SortBy => void,
  onLoadMore: () => Promise<Array<Object>>,
};

export default function useSheet({
  itemsQuery,
  initialFilterBy,
  initialSortBy,
  cacheKey,
  getItems,
}: Input): Output {
  const client = useApolloClient();

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
          fetchPolicy: 'no-cache',
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
        fetchPolicy: 'no-cache',
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
    query,
    setQuery,
    filterBy,
    setFilterBy,
    sortBy,
    setSortBy,
    onLoadMore,
  };
}
