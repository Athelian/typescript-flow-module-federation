// @flow
import * as React from 'react';
import { TimelineDate, TimelinePortName } from '../../components';
import { VerticalDatesWrapperStyle } from './style';

type Props = {
  shipment: any,
};

const VerticalDates = ({ shipment }: Props) => {
  const { cargoReady, voyages } = shipment;

  const loadPort = voyages[0].departurePort;

  return (
    <div className={VerticalDatesWrapperStyle}>
      <TimelineDate timelineDate={cargoReady} />
      <TimelinePortName port={loadPort} />
    </div>
  );
};

export default VerticalDates;
