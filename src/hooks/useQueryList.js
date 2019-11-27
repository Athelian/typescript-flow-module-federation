// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { DocumentNode } from 'graphql';
import { type QueryHookOptions, useQuery } from '@apollo/react-hooks';
import { trackingError } from 'utils/trackingError';
import { getByPath, getByPathWithDefault, setIn } from 'utils/fp';

type ListResult<TNode> = {
  nodes: Array<TNode>,
  loading: boolean,
  hasMore: boolean,
  loadMore: () => void,
};

export default function useQueryList<TNode, TData, TVariable>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariable>,
  resultPath: string
): ListResult<TNode> {
  const intl = useIntl();

  const { data, loading, fetchMore } = useQuery<TData, TVariable>(query, {
    ...options,
    onError: err => {
      trackingError(err);
      toast.error(
        intl.formatMessage({
          id: 'global.apiErrorMessage',
          defaultMessage: 'There was an error. Please try again later.',
        })
      );
    },
  });

  const nodes = React.useMemo(() => getByPathWithDefault([], `${resultPath}.nodes`, data), [
    data,
    resultPath,
  ]);
  const page = React.useMemo(() => getByPathWithDefault(1, `${resultPath}.page`, data), [
    data,
    resultPath,
  ]);
  const totalPage = React.useMemo(() => getByPathWithDefault(1, `${resultPath}.totalPage`, data), [
    data,
    resultPath,
  ]);

  const loadMore = React.useCallback(() => {
    fetchMore<any>({
      variables: {
        ...options.variables,
        page: page + 1,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        const paginated = getByPath(resultPath, fetchMoreResult);

        return setIn(
          resultPath,
          {
            ...getByPath(resultPath, prevResult),
            nodes: [
              ...getByPathWithDefault([], `${resultPath}.nodes`, prevResult),
              ...paginated.nodes,
            ],
            page: paginated.page,
            totalPage: paginated.totalPage,
          },
          prevResult
        );
      },
    }).catch(err => {
      trackingError(err);
      toast.error(
        intl.formatMessage({
          id: 'global.apiErrorMessage',
          defaultMessage: 'There was an error. Please try again later.',
        })
      );
    });
  }, [intl, fetchMore, options, resultPath, page]);

  return { nodes, loading, hasMore: page < totalPage, loadMore };
}
