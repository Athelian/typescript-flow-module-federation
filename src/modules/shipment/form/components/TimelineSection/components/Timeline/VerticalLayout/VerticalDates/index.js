// @flow
import * as React from 'react';
import { TimelineDate } from '../../components';
import { VerticalDatesWrapperStyle } from './style';

type Props = {
  shipment: any,
};

const VerticalDates = ({ shipment }: Props) => {
  const { cargoReady } = shipment;

  return (
    <div className={VerticalDatesWrapperStyle}>
      <TimelineDate timelineDate={cargoReady} />
    </div>
  );
};

export default VerticalDates;
