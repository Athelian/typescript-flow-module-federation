// @flow
import * as React from 'react';
import { TimelineDate, TimelinePortName } from '../../components';
import {
  VerticalDatesWrapperStyle,
  SingularDateWrapperStyle,
  BlankGapStyle,
  VoyageDatesWrapperStyle,
} from './style';

type Props = {
  shipment: any,
};

const VerticalDates = ({ shipment }: Props) => {
  const { cargoReady, voyages, containerGroups, transportType } = shipment;
  const { customClearance, warehouseArrival, deliveryReady } = containerGroups[0];

  const loadPort = voyages[0].departurePort;
  const dischargePort = voyages[voyages.length - 1].arrivalPort;

  return (
    <div className={VerticalDatesWrapperStyle}>
      <div className={SingularDateWrapperStyle}>
        <TimelineDate timelineDate={cargoReady} vertical />
      </div>

      <div className={BlankGapStyle} />

      <TimelinePortName port={loadPort} transportType={transportType} vertical />

      <div className={VoyageDatesWrapperStyle}>
        <TimelineDate timelineDate={voyages[0].departure} prefixIcon="DEPARTURE" vertical />
        <TimelineDate timelineDate={voyages[0].arrival} prefixIcon="ARRIVAL" vertical />
      </div>

      {voyages.length > 1 &&
        voyages.slice(1).map(voyage => (
          <React.Fragment key={voyage.id}>
            <TimelinePortName port={voyage.departurePort} transportType={transportType} vertical />

            <div className={VoyageDatesWrapperStyle}>
              <TimelineDate timelineDate={voyage.departure} prefixIcon="DEPARTURE" vertical />
              <TimelineDate timelineDate={voyage.arrival} prefixIcon="ARRIVAL" vertical />
            </div>
          </React.Fragment>
        ))}

      <TimelinePortName port={dischargePort} transportType={transportType} vertical />

      <div className={BlankGapStyle} />

      <div className={SingularDateWrapperStyle}>
        <TimelineDate timelineDate={customClearance} vertical />
      </div>

      <div className={BlankGapStyle} />

      <div className={SingularDateWrapperStyle}>
        <TimelineDate timelineDate={warehouseArrival} vertical />
      </div>

      <div className={BlankGapStyle} />

      <div className={SingularDateWrapperStyle}>
        <TimelineDate timelineDate={deliveryReady} vertical />
      </div>
    </div>
  );
};

export default VerticalDates;
