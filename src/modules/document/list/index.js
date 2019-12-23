// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import type { FileInput, FilePayload } from 'generated/graphql';
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
  const mergeFiles = (allFiles: Array<FilePayload>) => {
    const fileIds = uploadFiles.map(file => file.id);
    return [...uploadFiles, ...allFiles.filter(file => !fileIds.includes(file.id))];
  };

  return (
    <Query query={documentListQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }

        const nextPage = data?.files?.page ?? 1 + 1;
        const totalPage = data?.files?.totalPage ?? 1;
        const hasMore = nextPage <= totalPage;

        return (
          <DocumentGridView
            files={mergeFiles(data?.files?.nodes ?? [])}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'files')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default DocumentList;
