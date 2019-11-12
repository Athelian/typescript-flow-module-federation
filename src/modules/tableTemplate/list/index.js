// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import emitter from 'utils/emitter';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import TableTemplateGridView from './TableTemplateGridView';
import { tableTemplateQuery } from './query';

type Props = {
  filterBy: {
    type: string,
  },
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
  page: number,
};

const TableTemplateList = ({ ...filtersAndSort }: Props) => {
  const isTableTemplate = window.location.href.includes('templates');
  return (
    <Query
      query={tableTemplateQuery}
      variables={{
        page: 1,
        ...filtersAndSort,
      }}
      fetchPolicy="network-only"
    >
      {({ loading, data, fetchMore, refetch, error }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, `maskEdits.page`, data) + 1;
        const totalPage = getByPathWithDefault(1, `maskEdits.totalPage`, data);
        const hasMore = nextPage <= totalPage;

        emitter.removeAllListeners('REFETCH_TABLE_TEMPLATES');
        emitter.addListener('REFETCH_TABLE_TEMPLATES', () => {
          if (isTableTemplate) refetch(tableTemplateQuery);
        });

        return (
          <TableTemplateGridView
            items={getByPathWithDefault([], 'maskEdits.nodes', data)}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'maskEdits')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default TableTemplateList;
