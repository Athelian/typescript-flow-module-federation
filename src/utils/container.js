// @flow
import { injectUid } from './id';
/**
 * generate a container
 *
 * without:
 *   - freeTimeStart
 *   - shipment
 */
export const generateContainer = ({ no }: { no: string }) =>
  injectUid({
    isNew: true,
    no,
    batches: [],
    tags: [],
    totalVolume: {
      metric: 'm³',
      value: 0,
    },
    totalWeight: {
      metric: 'kg',
      value: 0,
    },
    totalBatchQuantity: 0,
    totalBatchPackages: 0,
    totalNumberOfUniqueOrderItems: 0,
    warehouseArrivalActualDateAssignedTo: [],
    warehouseArrivalAgreedDateAssignedTo: [],
    representativeBatch: null,
    autoCalculatedFreeTimeStartDate: true,
    freeTimeDuration: 14,
    departureDateAssignedTo: [],
  });

export default generateContainer;
