// @flow
import * as React from 'react';
// import { getByPathWithDefault } from 'utils/fp';
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

const requeryThreshold = 100;

// TODO: need to have pagination if > 100 tags
/**
 * @param entityOwnerId organization id that owns the entity
 */
const TagListProvider = ({ children, tagType, entityOwnerId, queryString }: Props) => {
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
      name: 'ascending',
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

  const [getTags, { data, loading }] = useLazyQuery(
    entityOwnerId ? tagsForEntityQuery : tagsQuery,
    {
      variables,
      fetchPolicy: 'network-only',
      onCompleted: newData => {
        const value = newData?.tagsForEntity ?? newData?.tags;
        console.log('value.totalPage', value.totalPage);
        setTotalPages(value.totalPage);
      },
    }
  );

  const [tagData, setTagData] = React.useState([]);
  // console.log('data is ', data);

  React.useEffect(() => {
    if (!data || loading) {
      return;
    }

    console.log(
      'new data is data?.tagsForEntity?.nodes ?? data?.tags?.nodes',
      data?.tagsForEntity?.nodes ?? data?.tags?.nodes
    );
    setTagData(oldTagData => {
      return [...oldTagData, ...(data?.tagsForEntity?.nodes ?? data?.tags?.nodes ?? [])];
    });

    // return () => {
    //   isMounted.current = false;
    // };
  }, [data, loading]);

  // const tagData = data
  //   ? getByPathWithDefault([], entityOwnerId ? 'tagsForEntity.nodes' : 'tags.nodes', data)
  //   : [];

  React.useEffect(() => {
    if (
      (isMounted.current && totalPages === 0) ||
      (pageSettings.page !== 1 && totalPages > 0 && pageSettings.page <= totalPages)
    ) {
      console.log('getting new tags pageSettings.page', pageSettings.page);
      getTags();
    }

    return () => {
      isMounted.current = false;
    };
  }, [debouncedQueryString, getTags, totalPages, pageSettings]);

  const onScroll = React.useCallback(
    (scrollTop, event) => {
      // console.log('adasdasd222', event.target, !event.target);
      // console.log('!event.target', );
      // console.log('adasdasd222', event);
      if (!event.target) {
        return;
      }
      // console.log('event.target.clientHeight', event.target.clientHeight);
      // console.log('event.target.scrollHeight', event.target.scrollHeight, event.target.scrollTop);
      // console.log('event.target.scrollHeight - event.target.scrollTop', event.target.scrollHeight - event.target.scrollTop);
      // console.log('event.target.scrollHeight - event.target.scrollTop', event.target.scrollHeight - event.target.scrollTop, event.target.clientHeight);
      const nearTheBottom =
        event.target.scrollHeight - event.target.scrollTop <=
        event.target.clientHeight + requeryThreshold;
      // const nearTheBottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
      if (!loading && nearTheBottom) {
        setPageSettings(oldSettings => {
          // console.log('old settings is ', oldSettings);
          return {
            ...oldSettings,
            page: oldSettings.page + 1,
          };
        });

        console.log('Near the bottom');
      }
    },
    [loading]
  );

  return children({
    data: tagData,
    loading,
    onScroll,
  });
};

export default TagListProvider;
