// @flow
// import * as React from 'react';

export const getTimelineColoring = ({
  cargoReadyDate,
  voyages,
  containerGroups,
}: {
  cargoReadyDate: any,
  voyages: any,
  containerGroups: any,
}): Array<string> => {
  const { customClearanceDate, warehouseArrivalDate, deliveryReadyDate } = containerGroups[0];

  // Add all boolean approvals of all the dates to an array in order
  const arrayOfApprovals = [!!cargoReadyDate.approvedAt];
  voyages.forEach(voyage => {
    arrayOfApprovals.push(!!voyage.departure.approvedAt, !!voyage.arrival.approvedAt);
  });
  arrayOfApprovals.push(
    !!customClearanceDate.approvedAt,
    !!warehouseArrivalDate.approvedAt,
    !!deliveryReadyDate.approvedAt
  );

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

export default getTimelineColoring;
