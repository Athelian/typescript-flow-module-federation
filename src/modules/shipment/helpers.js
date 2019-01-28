// @flow
import { isNullOrUndefined } from 'utils/fp';

export const getShipmentSummary = (shipment: Object) => {
  const totalBatches = shipment.batches ? shipment.batches.length : 0;
  const batchesOfActiveOrder = shipment.batches.reduce(
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

export const isSelectedCard = (selected: ?string) => !isNullOrUndefined(selected);

export const isSelectedBatchesPool = (selected: ?string) =>
  isSelectedCard(selected) && selected === BATCHES_POOL;

export const isSelectedContainer = (selected: ?string) =>
  isSelectedCard(selected) && selected !== BATCHES_POOL;

export const getUsefulBatches = (
  batches: Array<Object>,
  selectedContainerId: ?string
): {
  usefulBatches: Array<Object>,
  leftCardIsSelected: boolean,
  containerIsSelected: boolean,
} => {
  let usefulBatches = batches.slice(0);

  const leftCardIsSelected = isSelectedCard(selectedContainerId);

  const containerIsSelected = isSelectedContainer(selectedContainerId);

  if (leftCardIsSelected) {
    if (containerIsSelected) {
      usefulBatches = usefulBatches.filter(batch =>
        !isNullOrUndefined(batch.container) ? batch.container.id === selectedContainerId : false
      );
    } else {
      usefulBatches = usefulBatches.filter(batch => isNullOrUndefined(batch.container));
    }
  }
  return { usefulBatches, leftCardIsSelected, containerIsSelected };
};
