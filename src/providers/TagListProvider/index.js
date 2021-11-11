// @flow
import useTagList from 'hooks/useTagList';

import { tagsQuery } from './query';
import type { TagsQueryType } from './type.js.flow';

type Props = {
  children: any,
  tagType: TagsQueryType,
  entityOwnerId?: string,
  queryString?: string,
};

/**
 * @param entityOwnerId organization id that owns the entity
 */
const TagListProvider = ({ children, tagType, entityOwnerId, queryString }: Props) => {
  const { tags, loading, onScroll } = useTagList({
    tagType,
    entityOwnerId,
    query: tagsQuery,
    queryString,
  });

  return children({
    data: tags,
    loading,
    onScroll,
  });
};

export default TagListProvider;
