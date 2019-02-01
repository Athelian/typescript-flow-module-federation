// @flow
import * as React from 'react';
import { getContainerDatesRange } from 'modules/shipment/form/components/TimelineSection/components/Timeline/helpers';
import { TimelineDate, TimelinePortName, TimelineWarehouseName } from '../../components';
import { TimelineDateRange } from './components';
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
  const { cargoReady, voyages, containerGroups, transportType, containers } = shipment;
  const { customClearance, warehouseArrival, deliveryReady } = containerGroups[0];
  const { warehouse } = containers && containers.length > 0 ? containers[0] : containerGroups[0];
  const loadPort = voyages[0].departurePort;
  const dischargePort = voyages[voyages.length - 1].arrivalPort;
  const {
    minAgreedDate,
    maxAgreedDate,
    agreedApproved,
    minActualDate,
    maxActualDate,
    actualApproved,
  } = getContainerDatesRange(containers);

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

      <div className={BlankGapStyle}>
        {containers && containers.length > 0 ? (
          <TimelineDateRange
            minDate={minAgreedDate}
            maxDate={maxAgreedDate}
            approved={agreedApproved}
            color="BLUE"
          />
        ) : (
          <TimelineDate timelineDate={warehouseArrival} vertical />
        )}
      </div>

      <TimelineWarehouseName name={warehouse && warehouse.name} vertical containers={containers} />

      {containers && containers.length > 0 ? (
        <div className={BlankGapStyle}>
          <TimelineDateRange
            minDate={minActualDate}
            maxDate={maxActualDate}
            approved={actualApproved}
            color="TEAL"
          />
        </div>
      ) : (
        <div className={BlankGapStyle} />
      )}

      <div className={SingularDateWrapperStyle}>
        <TimelineDate timelineDate={deliveryReady} vertical />
      </div>
    </div>
  );
};

export default VerticalDates;
