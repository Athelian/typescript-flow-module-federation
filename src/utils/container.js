// @flow
import { injectUid } from './id';
/**
 * generate a container
 *
 * without:
 *   - no
 *   - freeTimeStart
 *   - shipment
 */
export const generateContainer = () =>
  injectUid({
    batches: [],
    tags: [],
    warehouseArrivalActualDateAssignedTo: [],
    warehouseArrivalAgreedDateAssignedTo: [],
    representativeBatch: null,
    autoCalculatedFreeTimeStartDate: true,
    freeTimeDuration: 14,
    departureDateAssignedTo: [],
  });

export default generateContainer;
