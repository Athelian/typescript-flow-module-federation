// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import useUser from 'hooks/useUser';
import { TimelineDate, TimelineDateContainers } from '../../components';
import {
  HorizontalDatesWrapperStyle,
  SingleDateWrapperStyle,
  DoubleDatesWrapperStyle,
  BlankPlaceholderStyle,
  ArrivalDepartureIconsWrapperStyle,
} from './style';

type Props = {
  shipment: any,
};

const HorizontalDates = ({ shipment }: Props) => {
  const { user } = useUser();
  const { cargoReady, voyages, containerGroups, containers } = shipment;
  const { customClearance, warehouseArrival, deliveryReady } = containerGroups[0];

  if ((containers && containers.length > 0) || voyages.length > 1) {
    return (
      <div className={HorizontalDatesWrapperStyle}>
        <div className={ArrivalDepartureIconsWrapperStyle}>
          <Icon icon="ARRIVAL_HORIZONTAL" />
          <Icon icon="DEPARTURE_HORIZONTAL" />
        </div>

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={cargoReady} user={user} />
          <div className={BlankPlaceholderStyle} />
        </div>

        <div className={DoubleDatesWrapperStyle}>
          <div className={BlankPlaceholderStyle} />
          <TimelineDate timelineDate={voyages[0].departure} user={user} />
        </div>

        {voyages.length > 1 &&
          voyages.slice(1).map((voyage, voyageIndex) => (
            <div className={DoubleDatesWrapperStyle} key={voyage.id}>
              <TimelineDate timelineDate={voyages[voyageIndex].arrival} user={user} />
              <TimelineDate timelineDate={voyage.departure} user={user} />
            </div>
          ))}

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={voyages[voyages.length - 1].arrival} user={user} />
          <div className={BlankPlaceholderStyle} />
        </div>

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={customClearance} user={user} />
          <div className={BlankPlaceholderStyle} />
        </div>

        {containers && containers.length > 0 ? (
          <TimelineDateContainers containers={containers} user={user} />
        ) : (
          <div className={DoubleDatesWrapperStyle}>
            <TimelineDate timelineDate={warehouseArrival} user={user} />
            <div className={BlankPlaceholderStyle} />
          </div>
        )}

        <div className={DoubleDatesWrapperStyle}>
          <TimelineDate timelineDate={deliveryReady} user={user} />
          <div className={BlankPlaceholderStyle} />
        </div>
      </div>
    );
  }

  return (
    <div className={HorizontalDatesWrapperStyle}>
      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={cargoReady} user={user} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={voyages[0].departure} user={user} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={voyages[voyages.length - 1].arrival} user={user} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={customClearance} user={user} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={warehouseArrival} user={user} />
      </div>

      <div className={SingleDateWrapperStyle}>
        <TimelineDate timelineDate={deliveryReady} user={user} />
      </div>
    </div>
  );
};

export default HorizontalDates;
