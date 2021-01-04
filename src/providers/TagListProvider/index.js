// @flow
import * as React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import { useLazyQuery } from '@apollo/react-hooks';
import { tagsQuery } from './query';
import type { TagsQueryType } from './type.js.flow';
import useDebounce from '../../hooks/useDebounce';

type Props = {
  children: any,
  tagType: TagsQueryType,
  queryString?: string,
};

// TODO: need to have pagination if > 100 tags
const TagListProvider = ({ children, tagType, queryString }: Props) => {
  const isMounted = React.useRef(true);
  const debouncedQueryString = useDebounce(queryString, 200);

  const [getTags, { data, loading }] = useLazyQuery(tagsQuery, {
    variables: { page: 1, perPage: 100, entityTypes: [tagType], query: debouncedQueryString || '' },
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (isMounted.current) {
      getTags();
    }

    return () => {
      isMounted.current = false;
    };
  }, [debouncedQueryString, getTags]);

  // if loading, return last data to not show an empty list
  if (loading) {
    return children({
      data: data ? getByPathWithDefault([], `tags.nodes`, data) : [],
      loading,
    });
  }

  // if not loading, return new data
  return children({
    data: !loading && data ? getByPathWithDefault([], `tags.nodes`, data) : [],
    loading,
  });
};

export default TagListProvider;
