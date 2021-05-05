// @flow
import { isNullOrUndefined, isDataType, getByPathWithDefault } from 'utils/fp';
import { parseFilesField } from 'utils/data';

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
  containerId: ?string
): Array<Object> => {
  if (!containerId) return batches;

  return batches
    .slice(0)
    .filter(batch => getByPathWithDefault(null, 'container.id', batch) === containerId);
};

export const getBatchesInPool = (batches: Array<Object>): Array<Object> =>
  batches.filter(batch => isNullOrUndefined(batch.container));

export const getAgreedArrivalDates = (containers: Array<Object>): Array<Object> =>
  containers
    .map(({ warehouseArrivalAgreedDate }) => warehouseArrivalAgreedDate)
    .filter(Boolean)
    .map(item => new Date(item));

export const getActualArrivalDates = (containers: Array<Object>): Array<Object> =>
  containers
    .map(({ warehouseArrivalActualDate }) => warehouseArrivalActualDate)
    .filter(Boolean)
    .map(item => new Date(item));

export const numAgreedArrivalDateApproved = (containers: Array<Object>): number =>
  containers
    .map(({ warehouseArrivalAgreedDateApprovedBy }) => warehouseArrivalAgreedDateApprovedBy)
    .filter(Boolean).length;

export const numActualArrivalDateApproved = (containers: Array<Object>): number =>
  containers
    .map(({ warehouseArrivalActualDateApprovedBy }) => warehouseArrivalActualDateApprovedBy)
    .filter(Boolean).length;

/**
 * Merges latest files with local file state
 */
export const mergeFileStates = ({ originalValues, newValues, latestFiles = [] }) => {
  const { changed, deleted } = parseFilesField(
    'files',
    originalValues.files,
    newValues.files,
    true
  );

  const deletedFilesById = deleted.files.reduce((arr, file) => {
    // eslint-disable-next-line
    arr[file.id] = true;

    return arr;
  }, {});

  const changedFilesById = changed.files.reduce((arr, file) => {
    // an unchanged file object would have this format { id: 'asidnoqn' }
    if (Object.keys(file).length > 1) {
      // eslint-disable-next-line
      arr[file.id] = file;
    }

    return arr;
  }, {});

  // remove deleted files
  const newFileState = JSON.parse(JSON.stringify(latestFiles))
    .filter(file => !deletedFilesById[file.id])
    .map(file => {
      // set the changed files
      // file ids that do not exist in latestFiles are newly uploaded files
      if (changedFilesById[file.id]) {
        const changedFile = changedFilesById[file.id];
        delete changedFilesById[file.id];
        return changedFile;
      }

      return { id: file.id };
    });

  // add newly uploaded files
  newFileState.push(...Object.values(changedFilesById));

  return newFileState;
};
