// @flow
import * as React from 'react';
import { TimelinePortName, TimelineWarehouseName } from '../../components';
import { HorizontalPortsWrapperStyle, PortNameWrapperStyle, BlankSpaceStyle } from './style';

type Props = {
  shipment: any,
};

const HorizontalPortNames = ({ shipment }: Props) => {
  const { voyages, transportType, containerGroups, containers } = shipment;

  const loadPort = voyages[0].departurePort;
  const dischargePort = voyages[voyages.length - 1].arrivalPort;
  const { warehouse } = containerGroups[0];

  return (
    <div className={HorizontalPortsWrapperStyle}>
      <div className={BlankSpaceStyle} />

      <div className={PortNameWrapperStyle}>
        <TimelinePortName port={loadPort} transportType={transportType} />
      </div>

      {voyages.length > 1 &&
        voyages.slice(1).map(voyage => (
          <div className={PortNameWrapperStyle} key={voyage.id}>
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

      <div className={BlankSpaceStyle} />

      <div className={PortNameWrapperStyle}>
        <TimelineWarehouseName name={warehouse && warehouse.name} containers={containers} />
      </div>

      <div className={BlankSpaceStyle} />
    </div>
  );
};

export default HorizontalPortNames;
