// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
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
|};

const DocumentList = ({ uploadFiles, ...filtersAndSort }: Props) => {
  const [deleteIds, setDeleteIds] = React.useState([]);
  const mergeFiles = (allFiles: Array<FilePayload>) => {
    const fileIds = uploadFiles.map(file => file.id);
    return [
      ...uploadFiles.filter(file => !deleteIds.includes(file.id)),
      ...allFiles.filter(file => !fileIds.includes(file.id) && !deleteIds.includes(file.id)),
    ];
  };

  return (
    <Query query={documentListQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => {
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
            afterDelete={fileId => {
              setDeleteIds([...deleteIds, fileId]);
            }}
          />
        );
      }}
    </Query>
  );
};

export default DocumentList;
