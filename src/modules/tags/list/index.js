// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import emitter from 'utils/emitter';
import TagGridView from './TagGridView';
import { tagsQuery } from './query';

type Props = {
  perPage: number,
  page: number,
};

const TagList = ({ ...filtersAndSort }: Props) => {
  return (
    <Query
      query={tagsQuery}
      variables={{
        page: 1,
        ...filtersAndSort,
      }}
      fetchPolicy="network-only"
    >
      {({ loading, data, fetchMore, error, refetch }) => {
        if (error) {
          return error.message;
        }
        const nextPage = getByPathWithDefault(1, `tags.page`, data) + 1;
        const totalPage = getByPathWithDefault(1, `tags.totalPage`, data);
        const hasMore = nextPage <= totalPage;

        emitter.once('DELETE_TAG', () => {
          refetch();
        });

        return (
          <TagGridView
            items={getByPathWithDefault([], 'tags.nodes', data)}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'tags')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default TagList;
