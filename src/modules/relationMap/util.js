// @flow
import { getByPathWithDefault } from 'utils/fp';

export const getBatchArrivalDate = (batch: Object) => {
  const arrivalDates = getByPathWithDefault(
    [],
    'shipment.containerGroups.0.warehouseArrival.timelineDateRevisions',
    batch
  );

  return arrivalDates.length > 0
    ? arrivalDates[arrivalDates.length - 1].date
    : getByPathWithDefault('', 'shipment.containerGroups.0.warehouseArrival.date', batch);
};

export const sortBatchByArrivalDate = (batchA: Object, batchB: Object) => {
  const arrivalDateA = getBatchArrivalDate(batchA);
  const arrivalDateB = getBatchArrivalDate(batchB);

  if (arrivalDateA < arrivalDateB) {
    return 1;
  }
  if (arrivalDateA > arrivalDateB) {
    return -1;
  }
  return 0;
};
