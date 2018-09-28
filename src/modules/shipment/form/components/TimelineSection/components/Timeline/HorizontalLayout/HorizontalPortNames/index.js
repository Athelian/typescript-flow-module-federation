// @flow
import * as React from 'react';
import { TimelinePortName } from '../../components';
import { HorizontalDatesWrapperStyle } from './style';

type Props = {
  shipment: any,
};

const HorizontalPortNames = ({ shipment }: Props) => {
  const { voyages, transportType } = shipment;

  const loadPort = voyages[0].departurePort;
  const dischargePort = voyages[voyages.length - 1].arrivalPort;

  const WIDTH_OF_PORT = 145;
  const WIDTH_OF_ICON = 30;
  let lineWidth = 113.33;
  if (voyages.length === 2) {
    lineWidth = 81.25;
  } else if (voyages.length === 3) {
    lineWidth = 62;
  }

  const leftPadding = WIDTH_OF_ICON * 1.5 + lineWidth - WIDTH_OF_PORT / 2;
  const rightPadding = WIDTH_OF_ICON * 3.5 + lineWidth * 3 - WIDTH_OF_PORT / 2;

  return (
    <div className={HorizontalDatesWrapperStyle({ leftPadding, rightPadding })}>
      <TimelinePortName port={loadPort} transportType={transportType} />
      {voyages.length > 1 &&
        voyages
          .slice(1)
          .map(voyage => (
            <TimelinePortName
              port={voyage.departurePort}
              transportType={transportType}
              key={voyage.id}
            />
          ))}
      <TimelinePortName port={dischargePort} transportType={transportType} />
    </div>
  );
};

export default HorizontalPortNames;
