// @flow
// import * as React from 'react';
import { is, last } from 'ramda';
import type {
  DetailedShipmentContainerGroup,
  DetailedShipmentVoyage,
  TimelineDate,
} from 'modules/shipment/type.js.flow';
// import FormattedEnum from 'components/FormattedEnum';

const parsePortName = (transportType: ?string, port: ?Object | ?string): string => {
  if (is(String, port)) {
    return port;
  }

  if (transportType) {
    if (transportType === 'Sea') {
      return port.locode || '';
    }
    if (transportType === 'Air') {
      return port.iata || '';
    }
  }
  return '';
};

export const getPortName = (transportType: ?string, port: ?Object | ?string) =>
  port
    ? // <FormattedEnum
      // value={parsePortName(transportType, port)}
      // enumType={['SeaportEnum', 'AirportEnum']}
      // />
      parsePortName(transportType, port)
    : null;

export const getDistanceOfDays = (firstDate: string | Date, secondDate: string | Date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const first = new Date(firstDate).getTime();
  const second = new Date(secondDate).getTime();

  return Math.round((first - second) / oneDay);
};

export const getLastActualDate = (timelineDate: ?TimelineDate) => {
  if (!timelineDate) {
    return null;
  }
  const lastDate = last(
    timelineDate.actualDates.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  );

  return lastDate ? lastDate.date : null;
};

export const getColoring = ({
  cargoReadyDate,
  voyages,
  containerGroups,
}: {
  cargoReadyDate: TimelineDate,
  voyages: Array<DetailedShipmentVoyage>,
  containerGroups: Array<DetailedShipmentContainerGroup>,
}): Array<string> => {
  const { customClearanceDate, warehouseArrivalDate, deliveryReadyDate } = containerGroups[0];

  // Add all boolean approvals of all the dates to an array in order
  const arrayOfApprovals = [!!cargoReadyDate.approvedAt];
  voyages.forEach(voyage => {
    arrayOfApprovals.push(!!voyage.departureDate.approvedAt, !!voyage.arrivalDate.approvedAt);
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
      arrayOfColors.push('BLUE');
    } else if (approval) {
      approvalFlag = true;
      arrayOfColors.push('BLUE');
    } else {
      arrayOfColors.push('GRAY_LIGHT');
    }
  });

  return arrayOfColors.reverse();
};
