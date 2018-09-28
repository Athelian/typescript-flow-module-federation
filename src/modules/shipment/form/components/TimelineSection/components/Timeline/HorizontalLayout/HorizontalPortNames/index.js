// @flow
import * as React from 'react';
import { TimelinePortName } from '../../components';
import { HorizontalPortsWrapperStyle, PortNameWrapperStyle, BlankSpaceStyle } from './style';

type Props = {
  shipment: any,
};

const HorizontalPortNames = ({ shipment }: Props) => {
  const { voyages, transportType } = shipment;

  const loadPort = voyages[0].departurePort;
  const dischargePort = voyages[voyages.length - 1].arrivalPort;

  return (
    <div className={HorizontalPortsWrapperStyle}>
      <div className={BlankSpaceStyle(1)} />

      <div className={PortNameWrapperStyle}>
        <TimelinePortName port={loadPort} transportType={transportType} />
      </div>

      {voyages.length > 1 &&
        voyages.slice(1).map(voyage => (
          <div className={PortNameWrapperStyle}>
            <TimelinePortName
              port={voyage.departurePort}
              transportType={transportType}
              key={voyage.id}
            />
          </div>
        ))}

      <div className={PortNameWrapperStyle}>
        <TimelinePortName port={dischargePort} transportType={transportType} />
      </div>

      <div className={BlankSpaceStyle(3)} />
    </div>
  );
};

export default HorizontalPortNames;
