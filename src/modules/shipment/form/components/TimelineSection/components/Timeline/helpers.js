// @flow
import * as React from 'react';
import EnumProvider from 'providers/enum';

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

export const getPortName = (enumType: ?('Seaport' | 'Airport'), portValue: ?string) => {
  if (enumType && portValue) {
    return (
      <EnumProvider enumType={enumType}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return `Error!: ${error}`;

          const searchedPort = data.find(portInList => portInList.name === portValue);

          if (searchedPort) {
            return searchedPort.description;
          }

          return 'Not found';
        }}
      </EnumProvider>
    );
  }
  return null;
};
