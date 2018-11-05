// @flow
import React from 'react';
import loadMoreUtil from 'utils/loadMore';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';

type Props = {
  loading?: boolean,
  data: any,
  fetchMore: Function,
  model: string,
  children: Function,
  error?: Object,
  onChangePage?: Function,
  filter?: Object,
};

// TODO: how to send the filter and sort
const QueryHandler = ({
  loading,
  data,
  fetchMore,
  model,
  children,
  error,
  onChangePage,
  filter,
}: Props) => {
  if (error) {
    return error.message;
  }
  if (loading) {
    return <LoadingIcon />;
  }
  const nodes = getByPathWithDefault(null, `${model}.nodes`, data);
  const currentPage = getByPathWithDefault(1, `${model}.page`, data);
  const nextPage = currentPage + 1;
  const totalPage = getByPathWithDefault(1, `${model}.totalPage`, data);
  const hasMore: boolean = nextPage <= totalPage;
  const loadMore = () => {
    loadMoreUtil({ fetchMore, data }, filter || {}, model);
    if (onChangePage) {
      onChangePage();
    }
  };
  // Save on local storage for table inline edit
  window.localStorage.setItem(model, JSON.stringify(nodes));
  return children({ nodes, hasMore, loadMore, currentPage });
};

export default QueryHandler;
