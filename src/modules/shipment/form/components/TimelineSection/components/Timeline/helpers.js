// @flow
import { isNullOrUndefined } from 'utils/fp';
import { isBefore, isAfter } from 'utils/date';

export const getTimelineColoring = ({
  cargoReady,
  voyages,
  containerGroups,
}: {
  cargoReady?: Object,
  voyages?: Array<{
    departure?: Object,
    arrival?: Object,
  }>,
  containerGroups?: Array<{
    customClearance?: Object,
    warehouseArrival?: Object,
    deliveryReady?: Object,
  }>,
}): Array<string> => {
  // Add all boolean approvals of all the dates to an array in order
  const arrayOfApprovals = [cargoReady && !!cargoReady.approvedAt];
  if (voyages && voyages.length) {
    voyages.forEach(voyage => {
      arrayOfApprovals.push(
        voyage.departure && !!voyage.departure.approvedAt,
        voyage.arrival && !!voyage.arrival.approvedAt
      );
    });
  }

  if (containerGroups && containerGroups.length) {
    const [{ customClearance, warehouseArrival, deliveryReady }] = containerGroups;
    arrayOfApprovals.push(
      customClearance && !!customClearance.approvedAt,
      warehouseArrival && !!warehouseArrival.approvedAt,
      deliveryReady && !!deliveryReady.approvedAt
    );
  }

  // Reverse the array in order to traverse it logically
  arrayOfApprovals.reverse();

  // Make new array to store colors by traversing through the arrayOfApprovals
  const arrayOfColors = [];
  let approvalFlag = false;
  arrayOfApprovals.forEach(approval => {
    if (approvalFlag) {
      arrayOfColors.push('TEAL');
    } else if (approval) {
      approvalFlag = true;
      arrayOfColors.push('TEAL');
    } else {
      arrayOfColors.push('GRAY_LIGHT');
    }
  });

  return arrayOfColors.reverse();
};

export const getTransportIcon = (transportType: ?string) => {
  if (transportType === 'Air') return 'PLANE';
  if (transportType === 'Sea') return 'SHIPMENT';
  return 'UNKNOWN';
};

export const getContainerDatesRange = (
  containers: Array<{
    warehouseArrivalAgreedDate: ?string,
    warehouseArrivalAgreedDateApprovedAt?: ?string,
    warehouseArrivalAgreedDateApprovedBy?: ?Object,
    warehouseArrivalActualDate: ?string,
    warehouseArrivalActualDateApprovedAt?: ?string,
    warehouseArrivalActualDateApprovedBy?: ?Object,
  }> = []
) => {
  let minAgreedDate = null;
  let maxAgreedDate = null;
  let agreedApproved = false;
  let minActualDate = null;
  let maxActualDate = null;
  let actualApproved = false;

  let agreedApprovalCounter = 0;
  let actualApprovalCounter = 0;

  containers.forEach(
    ({
      warehouseArrivalAgreedDate,
      warehouseArrivalAgreedDateApprovedAt,
      warehouseArrivalAgreedDateApprovedBy,
      warehouseArrivalActualDate,
      warehouseArrivalActualDateApprovedAt,
      warehouseArrivalActualDateApprovedBy,
    }) => {
      if (!isNullOrUndefined(warehouseArrivalAgreedDate)) {
        if (!isNullOrUndefined(minAgreedDate)) {
          if (isBefore(new Date(warehouseArrivalAgreedDate), new Date(minAgreedDate))) {
            minAgreedDate = warehouseArrivalAgreedDate;
          }
        } else {
          minAgreedDate = warehouseArrivalAgreedDate;
        }

        if (!isNullOrUndefined(maxAgreedDate)) {
          if (isAfter(new Date(warehouseArrivalAgreedDate), new Date(maxAgreedDate))) {
            maxAgreedDate = warehouseArrivalAgreedDate;
          }
        } else {
          maxAgreedDate = warehouseArrivalAgreedDate;
        }
      }

      if (!isNullOrUndefined(warehouseArrivalActualDate)) {
        if (!isNullOrUndefined(minActualDate)) {
          if (isBefore(new Date(warehouseArrivalActualDate), new Date(minActualDate))) {
            minActualDate = warehouseArrivalActualDate;
          }
        } else {
          minActualDate = warehouseArrivalActualDate;
        }

        if (!isNullOrUndefined(maxActualDate)) {
          if (isAfter(new Date(warehouseArrivalActualDate), new Date(maxActualDate))) {
            maxActualDate = warehouseArrivalActualDate;
          }
        } else {
          maxActualDate = warehouseArrivalActualDate;
        }
      }

      if (
        !isNullOrUndefined(warehouseArrivalAgreedDateApprovedAt) ||
        !isNullOrUndefined(warehouseArrivalAgreedDateApprovedBy)
      ) {
        agreedApprovalCounter += 1;
      }

      if (
        !isNullOrUndefined(warehouseArrivalActualDateApprovedAt) ||
        !isNullOrUndefined(warehouseArrivalActualDateApprovedBy)
      ) {
        actualApprovalCounter += 1;
      }
    }
  );

  if (agreedApprovalCounter === containers.length) {
    agreedApproved = true;
  }

  if (actualApprovalCounter === containers.length) {
    actualApproved = true;
  }

  return {
    minAgreedDate,
    maxAgreedDate,
    agreedApproved,
    minActualDate,
    maxActualDate,
    actualApproved,
  };
};
