// @flow
import * as React from 'react';
import { getContainerDatesRange } from 'modules/shipment/form/components/TimelineSection/components/Timeline/helpers';
import useUser from 'hooks/useUser';
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
  const { user } = useUser();
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
        <TimelineDate timelineDate={cargoReady} user={user} vertical />
      </div>

      <div className={BlankGapStyle()} />

      <TimelinePortName port={loadPort} transportType={transportType} vertical />

      <div className={VoyageDatesWrapperStyle}>
        <TimelineDate
          timelineDate={voyages[0].departure}
          user={user}
          prefixIcon="DEPARTURE"
          vertical
        />
        <TimelineDate timelineDate={voyages[0].arrival} user={user} prefixIcon="ARRIVAL" vertical />
      </div>

      {voyages.length > 1 &&
        voyages.slice(1).map(voyage => (
          <React.Fragment key={voyage.id}>
            <TimelinePortName port={voyage.departurePort} transportType={transportType} vertical />

            <div className={VoyageDatesWrapperStyle}>
              <TimelineDate
                timelineDate={voyage.departure}
                user={user}
                prefixIcon="DEPARTURE"
                vertical
              />
              <TimelineDate
                timelineDate={voyage.arrival}
                user={user}
                prefixIcon="ARRIVAL"
                vertical
              />
            </div>
          </React.Fragment>
        ))}

      <TimelinePortName port={dischargePort} transportType={transportType} vertical />

      <div className={BlankGapStyle()} />

      <div className={SingularDateWrapperStyle}>
        <TimelineDate timelineDate={customClearance} user={user} vertical />
      </div>

      <div className={BlankGapStyle()}>
        {containers && containers.length > 0 ? (
          <TimelineDateRange
            minDate={minAgreedDate}
            maxDate={maxAgreedDate}
            approved={agreedApproved}
            user={user}
            color="BLUE"
          />
        ) : (
          <TimelineDate timelineDate={warehouseArrival} user={user} vertical />
        )}
      </div>

      <TimelineWarehouseName name={warehouse && warehouse.name} vertical containers={containers} />

      {containers && containers.length > 0 ? (
        <div className={BlankGapStyle('flex-start')}>
          <TimelineDateRange
            minDate={minActualDate}
            maxDate={maxActualDate}
            approved={actualApproved}
            user={user}
            color="TEAL"
          />
        </div>
      ) : (
        <div className={BlankGapStyle()} />
      )}

      <div className={SingularDateWrapperStyle}>
        <TimelineDate timelineDate={deliveryReady} user={user} vertical />
      </div>
    </div>
  );
};

export default VerticalDates;
