// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import DocumentGridView from './DocumentGridView';
import { documentListQuery } from './query';

type Props = {
  filterBy: {
    query: string,
  },
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
  page: number,
};

const DocumentList = ({ ...filtersAndSort }: Props) => {
  return (
    <Query query={documentListQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, 'files.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'files.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <DocumentGridView
            files={getByPathWithDefault([], 'files.nodes', data)}
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
