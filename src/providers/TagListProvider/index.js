// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import { tagsQuery } from './query';
import type { TagsQueryType } from './type.js.flow';

type Props = {
  children: any,
  tagType: TagsQueryType,
};

// TODO: need to have pagination if > 100 tags
const TagListProvider = ({ children, tagType }: Props) => (
  <Query
    fetchPolicy="network-only"
    query={tagsQuery}
    variables={{ page: 1, perPage: 100, entityTypes: [tagType] }}
  >
    {({ loading, data }) =>
      children({
        data: !loading && data ? getByPathWithDefault([], `tags.nodes`, data) : [],
        loading,
      })
    }
  </Query>
);

export default TagListProvider;