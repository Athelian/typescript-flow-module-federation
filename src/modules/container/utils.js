// @flow
import { uniqBy } from 'lodash';

type BatchProp = {
  orderItem: {
    order: {
      id: string,
    },
  },
};

export const uniqueOrders = (batches: Array<BatchProp>): Array<Object> =>
  uniqBy(batches.map(batch => batch.orderItem.order), 'id');

export default uniqueOrders;
