// @flow
import { getByPathWithDefault } from './fp';
import logger from './logger';

const loadMore = (
  clientData: { fetchMore: Function, data: ?Object },
  filtersAndSort: Object = {},
  selectedField: string = ''
) => {
  const { data, fetchMore } = clientData;
  logger.warn('loadMore', data);
  if (!data) return;
  const nextPage = getByPathWithDefault(1, `${selectedField}.page`, data) + 1;
  const totalPage = getByPathWithDefault(1, `${selectedField}.totalPage`, data);
  if (nextPage > totalPage) return;
  logger.warn('nextPage', nextPage);
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
      logger.warn('prevResult', prevResult);
      logger.warn('fetchMoreResult', fetchMoreResult);
      if (
        getByPathWithDefault({}, `${selectedField}.page`, prevResult) + 1 !==
        getByPathWithDefault({}, `${selectedField}.page`, fetchMoreResult)
      ) {
        return prevResult;
      }
      if (getByPathWithDefault([], `${selectedField}.nodes`, fetchMoreResult).length === 0)
        return prevResult;
      return {
        [selectedField]: {
          ...prevResult[selectedField],
          ...getByPathWithDefault({}, selectedField, fetchMoreResult),
          nodes: [
            ...prevResult[selectedField].nodes,
            ...getByPathWithDefault([], `${selectedField}.nodes`, fetchMoreResult),
          ],
        },
      };
    },
  });
};
export default loadMore;
