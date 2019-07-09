// @flow
import type {
  TimelineDatePayload,
  VoyagePayload,
  ContainerGroupPayload,
  ContainerPayload,
  TransportType,
} from 'generated/graphql';
import { isNullOrUndefined, getByPath } from 'utils/fp';
import { isBefore, isAfter } from 'utils/date';

export const getTimelineColoring = ({
  cargoReady,
  voyages,
  containerGroups,
}: {
  cargoReady: TimelineDatePayload,
  voyages: Array<VoyagePayload>,
  containerGroups: Array<ContainerGroupPayload>,
}): Array<string> => {
  // Add all boolean approvals of all the dates to an array in order
  const arrayOfApprovals = [!!getByPath('approvedAt', cargoReady)];
  if (voyages && voyages.length) {
    voyages.forEach(voyage => {
      arrayOfApprovals.push(
        !!getByPath('departure.approvedAt', voyage),
        !!getByPath('arrival.approvedAt', voyage)
      );
    });
  }

  if (containerGroups && containerGroups.length) {
    const customClearance = getByPath('0.customClearance', containerGroups);
    const warehouseArrival = getByPath('0.warehouseArrival', containerGroups);
    const deliveryReady = getByPath('0.deliveryReady', containerGroups);
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

export const getTransportIcon = (transportType: TransportType) => {
  if (transportType === 'Air') return 'PLANE';
  if (transportType === 'Sea') return 'SHIPMENT';
  return 'UNKNOWN';
};

export const getContainerDatesRange = (containers: Array<ContainerPayload> = []) => {
  let minAgreedDate = null;
  let maxAgreedDate = null;
  let agreedApproved = false;
  let minActualDate = null;
  let maxActualDate = null;
  let actualApproved = false;

  let agreedApprovalCounter = 0;
  let actualApprovalCounter = 0;

  containers.forEach(container => {
    const warehouseArrivalAgreedDate = getByPath('warehouseArrivalAgreedDate', container);
    const warehouseArrivalAgreedDateApprovedAt = getByPath(
      'warehouseArrivalAgreedDateApprovedAt',
      container
    );
    const warehouseArrivalAgreedDateApprovedBy = getByPath(
      'warehouseArrivalAgreedDateApprovedBy',
      container
    );
    const warehouseArrivalActualDate = getByPath('warehouseArrivalActualDate', container);
    const warehouseArrivalActualDateApprovedAt = getByPath(
      'warehouseArrivalActualDateApprovedAt',
      container
    );
    const warehouseArrivalActualDateApprovedBy = getByPath(
      'warehouseArrivalActualDateApprovedBy',
      container
    );
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
  });

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
