// @flow
import { isNullOrUndefined, isDataType } from 'utils/fp';

export const getShipmentSummary = (shipment: Object) => {
  const totalBatches = shipment.batches ? shipment.batches.length : 0;
  const batchesOfActiveOrder = (shipment.batches || []).reduce(
    (total, { orderItem }) =>
      orderItem && orderItem.order && orderItem.order.archived ? total : total + 1,
    0
  );

  return {
    totalBatches,
    batchesOfActiveOrder,
    batchesOfArchivedOrder: totalBatches - batchesOfActiveOrder,
  };
};

export const BATCHES_POOL = 'Batches_Pool';

export const isFocusedBatchesPool = (selected: string | number | null): boolean =>
  selected === BATCHES_POOL;

export const isFocusedContainerCard = (selected: string | number | null): boolean =>
  isDataType(Number, selected);

export const getBatchesByContainerId = (
  batches: Array<Object>,
  containerId: string
): Array<Object> =>
  batches
    .slice(0)
    .filter(batch =>
      !isNullOrUndefined(batch.container) ? batch.container.id === containerId : false
    );

export const getBatchesInPool = (batches: Array<Object>): Array<Object> =>
  batches.filter(batch => isNullOrUndefined(batch.container));

export const getAgreedArrivalDates = (containers: Array<Object>): Array<Object> =>
  containers
    .map(({ warehouseArrivalAgreedDate }) => warehouseArrivalAgreedDate)
    .filter(item => !isNullOrUndefined(item))
    .map(item => new Date(item));

export const getActualArrivalDates = (containers: Array<Object>): Array<Object> =>
  containers
    .map(({ warehouseArrivalActualDate }) => warehouseArrivalActualDate)
    .filter(item => !isNullOrUndefined(item))
    .map(item => new Date(item));

export const numAgreedArrivalDateApproved = (containers: Array<Object>): number =>
  containers
    .map(({ warehouseArrivalAgreedDateApprovedBy }) => warehouseArrivalAgreedDateApprovedBy)
    .filter(item => !isNullOrUndefined(item)).length;

export const numActualArrivalDateApproved = (containers: Array<Object>): number =>
  containers
    .map(({ warehouseArrivalActualDateApprovedBy }) => warehouseArrivalActualDateApprovedBy)
    .filter(item => !isNullOrUndefined(item)).length;
