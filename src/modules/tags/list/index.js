// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import TagGridView from './TagGridView';
import { tagsQuery } from './query';

type Props = {
  perPage: number,
  page: number,
};

class TagList extends React.Component<Props> {
  render() {
    const { ...filtersAndSort } = this.props;

    return (
      <Query
        key={JSON.stringify(filtersAndSort)}
        query={tagsQuery}
        variables={{
          page: 1,
          ...filtersAndSort,
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, `tags.page`, data) + 1;
          const totalPage = getByPathWithDefault(1, `tags.totalPage`, data);
          const hasMore = nextPage <= totalPage;

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
  }
}

export default TagList;
