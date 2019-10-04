// @flow
import * as React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import { equals } from 'ramda';
import { clone } from '../utils/fp';

type List = {
  loading: boolean,
  loadingMore: boolean,
  hasMore: boolean,
  loadMore: () => void,
  nodes: Array<Object>,
};

export default function useListQuery(
  query: DocumentNode,
  variables?: Object,
  size: number = 20
): List {
  const client = useApolloClient();
  const [nodes, setNodes] = React.useState<Object>([]);
  const [page, setPage] = React.useState<{ page: number, totalPage: number }>({
    page: 1,
    totalPage: 1,
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const prevVariables = React.useRef(null);

  React.useEffect(() => {
    if (equals(prevVariables.current, variables)) {
      return () => {};
    }

    let cancel = false;

    setLoading(true);
    setNodes([]);
    setPage({ page: 1, totalPage: 1 });
    prevVariables.current = variables;

    client
      .query({
        query,
        variables: { page: 1, perPage: size, ...variables },
        fetchPolicy: 'network-only',
      })
      .then(({ data }) => {
        if (cancel) {
          return;
        }

        setPage({ page: 1, totalPage: data?.list?.totalPage ?? 1 });
        setNodes(clone(data?.list?.nodes ?? []));
        setLoading(false);
      });

    return () => {
      if (!equals(prevVariables.current, variables)) {
        cancel = true;
      }
    };
  }, [client, query, size, variables]);

  const loadMore = () => {
    if (loadingMore) {
      return;
    }

    setLoadingMore(true);

    client
      .query({
        query,
        variables: { page: page.page + 1, perPage: size, ...variables },
        fetchPolicy: 'network-only',
      })
      .then(({ data }) => {
        setPage({
          ...page,
          page: page.page + 1,
        });
        setNodes([...nodes, ...clone(data?.list?.nodes ?? [])]);
        setLoadingMore(false);
      });
  };

  return {
    loading,
    loadingMore,
    hasMore: page.page < page.totalPage,
    loadMore,
    nodes,
  };
}
