// @flow
import { getByPathWithDefault } from 'utils/fp';

/**
 * Check the result has next page or not
 * @param {Object} data result from graphql server
 * @param {string} model which nested field we want to select
 * @returns boolean true if has more page to load
 */
export const hasMoreItems = (data: Object, model: string = 'orders') => {
  const nextPage = getByPathWithDefault(1, `${model}.page`, data) + 1;
  const totalPage = getByPathWithDefault(1, `${model}.totalPage`, data);
  return nextPage <= totalPage;
};

export default hasMoreItems;
