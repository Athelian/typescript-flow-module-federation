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

// Returns max volume (in m^3) based on container type
export const getMaxVolume = (containerType: ?string) => {
  switch (containerType) {
    case '22G1': {
      return 33;
    }
    case '42G1': {
      return 67;
    }
    case '45G1': {
      return 76;
    }
    case '22R1': {
      return 27.9;
    }
    case '42R1': {
      return 56.1;
    }
    default: {
      return null;
    }
  }
};
