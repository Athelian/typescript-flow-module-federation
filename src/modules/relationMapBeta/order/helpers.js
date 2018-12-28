// @flow
import { getByPathWithDefault } from 'utils/fp';

export const hasMoreItems = (data: Object) => {
  const nextPage = getByPathWithDefault(1, 'orders.page', data) + 1;
  const totalPage = getByPathWithDefault(1, 'orders.totalPage', data);
  return nextPage <= totalPage;
};

export default hasMoreItems;
