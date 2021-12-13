// @flow
import useTagList from 'hooks/useTagList';

import { tagsQuery } from './query';
import type { TagsQueryType } from './type.js.flow';

type Props = {
  children: any,
  tagType: TagsQueryType,
  organizationIds?: string[],
  includeAllShared?: boolean,
  hasIntegratedTags?: boolean,
  queryString?: string,
};

const TagListProvider = ({
  children,
  tagType,
  organizationIds,
  includeAllShared,
  hasIntegratedTags,
  queryString,
}: Props) => {
  const { tags, loading, onScroll } = useTagList({
    tagType,
    organizationIds,
    includeAllShared,
    hasIntegratedTags,
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
