// @flow
import * as React from 'react';
import { getByPathWithDefault } from 'utils/fp';
import { useLazyQuery } from '@apollo/react-hooks';
import { tagsQuery, tagsForEntityQuery } from './query';
import type { TagsQueryType } from './type.js.flow';
import useDebounce from '../../hooks/useDebounce';

type Props = {
  children: any,
  tagType: TagsQueryType,
  entityOwnerId?: string,
  queryString?: string,
};

// TODO: need to have pagination if > 100 tags
/**
 * @param entityOwnerId organization id that owns the entity
 */
const TagListProvider = ({ children, tagType, entityOwnerId, queryString }: Props) => {
  const isMounted = React.useRef(true);
  const debouncedQueryString = useDebounce(queryString, 200);

  let variables = {
    page: 1,
    perPage: 100,
    query: debouncedQueryString || '',
  };

  if (entityOwnerId) {
    variables = {
      ...variables,
      entityOwnerId,
      entityType: tagType,
    };
  } else {
    variables = {
      ...variables,
      entityTypes: [tagType],
    };
  }

  const [getTags, { data, loading }] = useLazyQuery(
    entityOwnerId ? tagsForEntityQuery : tagsQuery,
    {
      variables,
      fetchPolicy: 'network-only',
    }
  );

  React.useEffect(() => {
    if (isMounted.current) {
      getTags();
    }

    return () => {
      isMounted.current = false;
    };
  }, [debouncedQueryString, getTags]);

  const tagData = data
    ? getByPathWithDefault([], entityOwnerId ? 'tagsForEntity.nodes' : 'tags.nodes', data)
    : [];

  return children({
    data: tagData,
    loading,
  });
};

export default TagListProvider;
