// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import tagsQuery from './query';
import type { TagsQueryType } from './type.js.flow';

type Props = {
  children: any,
  tagType: TagsQueryType,
};

const TagListProvider = ({ children, tagType }: Props) => {
  if (!tagsQuery(tagType)) return children({ data: [], loading: false });
  return (
    <Query query={tagsQuery(tagType)}>
      {({ loading, data }) =>
        children({
          data: !loading && data ? getByPathWithDefault([], `viewer.${tagType}`, data) : [],
          loading,
        })
      }
    </Query>
  );
};

export default TagListProvider;
