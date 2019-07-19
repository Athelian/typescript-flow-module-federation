// @flow
import type { BatchPayload, OrderPayload, MetricValue, ContainerPayload } from 'generated/graphql';
import { uniqBy } from 'lodash';
import { addDays } from 'date-fns';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { findVolume } from 'utils/batch';

export const uniqueOrders = (batches: Array<BatchPayload>): Array<OrderPayload> =>
  uniqBy(batches.map(batch => getByPath('orderItem.order', batch)).filter(Boolean), 'id');

export const calculateContainerTotalVolume = (container: ContainerPayload): MetricValue => ({
  metric: 'm³',
  value: getByPathWithDefault([], 'batches', container).reduce(
    (result, batch) => result + findVolume(batch),
    0
  ),
});

export const calculateDueDate = (freeTimeStartDate: string, freeTimeDuration: number = 0) =>
  addDays(new Date(freeTimeStartDate), freeTimeDuration);

export default uniqueOrders;
