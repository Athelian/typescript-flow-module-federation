// @flow
// import * as React from 'react';
// import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import { useQuery } from '@apollo/react-hooks';
import { tagsQuery } from './query';
import type { TagsQueryType } from './type.js.flow';

type Props = {
  children: any,
  tagType: TagsQueryType,
  queryString?: string,
};

// TODO: need to have pagination if > 100 tags
const TagListProvider = ({ children, tagType, queryString }: Props) => {
  const variables = { page: 1, perPage: 100, entityTypes: [tagType] };

  if (queryString) {
    variables.query = queryString;
  }

  const { data, loading } = useQuery(tagsQuery, {
    variables,
    fetchPolicy: 'network-only',
  });

  // if loading, return last data
  // if not loading, return new data
  // console.log('[debug] data is ', loading, data && data.tags && data.tags.nodes);

  return children({
    data: !loading && data ? getByPathWithDefault([], `tags.nodes`, data) : [],
    loading,
  });

  // return (
  //   <Query fetchPolicy="network-only" query={tagsQuery} variables={variables}>
  //     {({ loading, data }) => {
  //       // console.log('[debug] tag query 3');

  //       return children({
  //         data: !loading && data ? getByPathWithDefault([], `tags.nodes`, data) : [],
  //         loading,
  //       });
  //     }}
  //   </Query>
  // );
};

export default TagListProvider;
