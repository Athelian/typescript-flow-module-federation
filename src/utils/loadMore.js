// @flow
import { get, set, uniq } from 'lodash/fp';
import logger from './logger';

const loadMore = (
  clientData: { fetchMore: Function, data: ?Object },
  filtersAndSort: Object = {},
  selectedField: string = ''
) => {
  const { data, fetchMore } = clientData;
  logger.warn('loadMore', data);
  if (!data) return;
  const nextPage = get(`${selectedField}.page`, data) + 1;
  const totalPage = get(`${selectedField}.totalPage`, data);
  if (nextPage > totalPage) return;
  logger.warn('loadMore nextPage', nextPage);
  fetchMore({
    variables: {
      ...filtersAndSort,
      filter: filtersAndSort.filter,
      ...(filtersAndSort && filtersAndSort.sort
        ? { sort: { [filtersAndSort.sort.field]: filtersAndSort.sort.direction } }
        : {}),
      page: nextPage,
    },
    updateQuery: (prevResult, { fetchMoreResult }) => {
      logger.warn('updateQuery');

      if (
        get(`${selectedField}.page`, prevResult) + 1 !==
        get(`${selectedField}.page`, fetchMoreResult)
      ) {
        return prevResult;
      }

      if (get(`${selectedField}.nodes`, fetchMoreResult).length === 0) return prevResult;

      return set(
        `${selectedField}.nodes`,
        uniq([
          ...get(`${selectedField}.nodes`, prevResult),
          ...get(`${selectedField}.nodes`, fetchMoreResult),
        ]),
        fetchMoreResult
      );
    },
  });
};
export default loadMore;
