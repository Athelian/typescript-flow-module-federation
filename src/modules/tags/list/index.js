// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import matchSorter from 'match-sorter';
import type { Tag } from 'components/Tag/type.js.flow';
import TagGridView from './components/TagGridView';
import { tagsQuery } from './query';

type Props = {
  viewType: string,
  perPage: number,
  query: string,
  tabIndex: number,
};

class TagList extends React.PureComponent<Props> {
  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;

    const { tabIndex } = this.props;
    const tags = ['Product', 'Shipment', 'User', 'Batch', 'Order'];
    const tagsByTab = tags[tabIndex];

    const nextPage = getByPathWithDefault(1, `viewer.${tagsByTab}.page`, data) + 1;
    const totalPage = getByPathWithDefault(1, `viewer.${tagsByTab}.totalPage`, data);
    if (nextPage > totalPage) return;

    const { viewType, ...filtersAndSort } = this.props;

    fetchMore({
      variables: {
        page: nextPage,
        ...filtersAndSort,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        const { perPage } = this.props;
        if (
          !isEquals({ perPage }, filtersAndSort) ||
          getByPathWithDefault({}, `viewer.${tagsByTab}.page`, prevResult) + 1 !==
            getByPathWithDefault({}, `viewer.${tagsByTab}.page`, fetchMoreResult)
        ) {
          return prevResult;
        }

        if (getByPathWithDefault([], `viewer.${tagsByTab}`, fetchMoreResult).length === 0)
          return prevResult;

        return {
          viewer: {
            ...prevResult.viewer,
            [`${tagsByTab}`]: {
              ...prevResult.viewer[`${tagsByTab}`],
              ...getByPathWithDefault({}, `viewer.${tagsByTab}`, fetchMoreResult),
            },
          },
        };
      },
    });
  };

  filterTags = (tags: Array<Tag>): Array<Tag> => {
    const { query } = this.props;
    if (!query) return tags;

    return matchSorter(tags, query.trim(), { keys: ['description', 'name'] });
  };

  render() {
    const { viewType, tabIndex = 0, ...filtersAndSort } = this.props;

    const tags = ['Product', 'Shipment', 'User', 'Batch', 'Order'];
    const tagsByTab = tags[tabIndex];

    return (
      <Query
        query={tagsQuery}
        variables={{ page: 1, perPage: 100, entityTypes: [tagsByTab], ...filtersAndSort }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, `viewer.${tagsByTab}.page`, data) + 1;
          const totalPage = getByPathWithDefault(1, `viewer.${tagsByTab}.totalPage`, data);
          const hasMore = nextPage <= totalPage;

          return (
            <TagGridView
              items={this.filterTags(getByPathWithDefault([], `tags.nodes`, data))}
              onLoadMore={() => this.loadMore({ fetchMore, data })}
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
