// @flow

import * as React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import useDebounce from 'hooks/useDebounce';
import type { TagsQueryType } from 'providers/TagListProvider/type.js.flow';

type Props = {
  tagType: TagsQueryType,
  entityOwnerId?: string,
  queryString?: string,
  query?: any,
};

const requeryThreshold = 100;

const useTagList = ({ tagType, entityOwnerId, queryString, query }: Props) => {
  const isMounted = React.useRef(true);
  const debouncedQueryString = useDebounce(queryString, 200);

  const [pageSettings, setPageSettings] = React.useState({
    page: 1,
    perPage: 15,
  });

  const [totalPages, setTotalPages] = React.useState(0);

  let variables = {
    ...pageSettings,
    sortBy: {
      name: 'ASCENDING',
    },
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

  const [getTags, { data, loading }] = useLazyQuery(query, {
    variables,
    fetchPolicy: 'network-only',
    onCompleted: newData => {
      const value = newData?.tagsForEntity ?? newData?.tags;
      setTotalPages(value.totalPage);
    },
  });

  const [tagData, setTagData] = React.useState([]);

  React.useEffect(() => {
    if (!data || loading) {
      return;
    }

    setTagData(oldTagData => {
      return [...oldTagData, ...(data?.tagsForEntity?.nodes ?? data?.tags?.nodes ?? [])];
    });
  }, [data, loading]);

  React.useEffect(() => {
    if (
      (isMounted.current && totalPages === 0) ||
      (pageSettings.page !== 1 && totalPages > 0 && pageSettings.page <= totalPages)
    ) {
      getTags();
    }

    return () => {
      isMounted.current = false;
    };
  }, [debouncedQueryString, getTags, totalPages, pageSettings]);

  const onScroll = React.useCallback(
    ({ event, scrollHeight, scrollTop, clientHeight }) => {
      if (
        !event?.target &&
        (Number.isNaN(scrollHeight) || Number.isNaN(scrollTop) || Number.isNaN(clientHeight))
      ) {
        return;
      }

      let nearTheBottom = false;

      if (event) {
        nearTheBottom =
          event.target.scrollHeight - event.target.scrollTop <=
          event.target.clientHeight + requeryThreshold;
      } else {
        nearTheBottom = scrollHeight - scrollTop <= clientHeight + requeryThreshold;
      }

      if (!loading && pageSettings.page < totalPages && nearTheBottom) {
        setPageSettings(oldSettings => {
          return {
            ...oldSettings,
            page: oldSettings.page + 1,
          };
        });
      }
    },
    [loading, pageSettings.page, totalPages]
  );

  return {
    tags: tagData,
    loading,
    onScroll,
  };
};

export default useTagList;
