// @flow
import * as React from 'react';
import { useQuery } from 'react-apollo';
import type { FileInput, FilePayload } from 'generated/graphql';
import { isForbidden } from 'utils/data';
import loadMore from 'utils/loadMore';
import type { FilterBy, SortBy } from 'types';
import DocumentGridView from './DocumentGridView';
import { documentListQuery } from './query';

type Props = {|
  filterBy: FilterBy,
  sortBy: SortBy,
  perPage: number,
  page: number,
  uploadFiles: Array<FileInput>,
  onSelect: Function,
  refetchRef: any,
  selectedFiles: Object,
|};

const DocumentList = ({
  uploadFiles,
  onSelect,
  selectedFiles,
  refetchRef,
  ...filtersAndSort
}: Props) => {
  const [deleteIds, setDeleteIds] = React.useState([]);

  const mergeFiles = (allFiles: Array<FilePayload>) => {
    const fileIds = uploadFiles.map(file => file.id);
    return [
      ...uploadFiles.filter(file => !deleteIds.includes(file.id)),
      ...allFiles.filter(file => !fileIds.includes(file.id) && !deleteIds.includes(file.id)),
    ];
  };

  const { loading, data, fetchMore, error, refetch } = useQuery(documentListQuery, {
    variables: filtersAndSort,
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (refetchRef) {
      // eslint-disable-next-line
      refetchRef.current = refetch;
    }

    return () => {
      // eslint-disable-next-line
      refetchRef.current = null;
    };
  }, [refetchRef, refetch]);

  if (error) {
    return error.message;
  }

  const nextPage = (data?.files?.page ?? 1) + 1;
  const totalPage = data?.files?.totalPage ?? 1;
  const hasMore = nextPage <= totalPage;

  return (
    <DocumentGridView
      files={mergeFiles(data?.files?.nodes ?? []).filter(file => !isForbidden(file))}
      onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'files')}
      hasMore={hasMore}
      isLoading={loading}
      onSelect={onSelect}
      selectedFiles={selectedFiles}
      afterDelete={fileId => {
        setDeleteIds([...deleteIds, fileId]);
      }}
    />
  );
};

export default DocumentList;
