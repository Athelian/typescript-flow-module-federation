// @flow
import React from 'react';
import loadMoreUtil from 'utils/loadMore';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import { useIdb } from 'react-use-idb';

type OptionalProps = {
  filter?: Object,
  loading?: boolean,
  onChangePage?: Function,
};

type Props = OptionalProps & {
  data: any,
  fetchMore: Function,
  model: string,
  children: Function,
  error?: Object,
};

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
  // Save on indexDb for table inline edit
  const [db, setDb] = useIdb(model, []);
  if (error) {
    return error.message;
  }
  if (loading) {
    return <LoadingIcon />;
  }
  const currentPage = getByPathWithDefault(1, `${model}.page`, data);
  const nextPage = currentPage + 1;
  const nodes = getByPathWithDefault([], `${model}.nodes`, data);
  if (!isEquals(nodes, db)) setDb(nodes);
  const totalPage = getByPathWithDefault(1, `${model}.totalPage`, data);
  const hasMore: boolean = nextPage <= totalPage;
  const loadMore = () => {
    loadMoreUtil({ fetchMore, data }, filter || {}, model);
    if (onChangePage) {
      onChangePage({ nodes });
    }
  };
  return children({ nodes, hasMore, loadMore, currentPage });
};

export default QueryHandler;
