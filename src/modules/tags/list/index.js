// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import matchSorter from 'match-sorter';
import LoadingIcon from 'components/LoadingIcon';
import type { Tag } from 'components/Tag/type.js.flow';
import TagListView from './components/TagListView';
import {
  productTagsQuery,
  shipmentTagsQuery,
  userTagsQuery,
  batchTagsQuery,
  requestTagsQuery,
} from './query';

type Props = {
  viewType: string,
  perPage: number,
  query: string,
  tabIndex: number,
};

class TagList extends React.PureComponent<Props> {
  constructor() {
    super();

    this.tagQueries = [
      productTagsQuery,
      shipmentTagsQuery,
      userTagsQuery,
      batchTagsQuery,
      requestTagsQuery,
    ];
  }

  loadMorePage = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;

    const { tabIndex } = this.props;
    const tags = ['productTags', 'shipmentTags', 'userTags', 'batchTags', 'requestTags'];
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

    const filteredTags = matchSorter(tags, query.trim(), { keys: ['description', 'name'] });
    return filteredTags;
  };

  tagQueries: Array<string>;

  render() {
    const { viewType, tabIndex = 0, ...filtersAndSort } = this.props;

    const query = this.tagQueries[tabIndex];

    const tags = ['productTags', 'shipmentTags', 'userTags', 'batchTags', 'requestTags'];
    const tagsByTab = tags[tabIndex];

    return (
      <Query query={query} variables={{ page: 1, ...filtersAndSort }}>
        {({ loading, data, fetchMore, error }) => {
          const nextPage = getByPathWithDefault(1, `viewer.${tagsByTab}.page`, data) + 1;
          const totalPage = getByPathWithDefault(1, `viewer.${tagsByTab}.totalPage`, data);
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;

          return (
            <TagListView
              onLoadMore={() => this.loadMorePage({ fetchMore, data })}
              hasMore={nextPage <= totalPage}
              isLoading={loading}
              items={this.filterTags(getByPathWithDefault([], `viewer.${tagsByTab}`, data))}
            />
          );
        }}
      </Query>
    );
  }
}

export default TagList;
