// @flow
import * as React from 'react';
import type { ShipmentPayload } from 'generated/graphql';
import { getByPathWithDefault } from 'utils/fp';
import {
  TimelinePortName,
  TimelineWarehouseName,
} from 'modules/shipment/form/components/TimelineSection/components/Timeline/components';
import {
  HorizontalPortsWrapperStyle,
  PortNameWrapperStyle,
  BlankSpaceStyle,
  WarehouseNameWrapperStyle,
} from './style';

type Props = {|
  shipment: ShipmentPayload,
|};

const HorizontalPortNames = ({ shipment }: Props) => {
  const voyages = getByPathWithDefault([], 'voyages', shipment);
  const loadPort = voyages[0].departurePort;
  const containerGroups = getByPathWithDefault([], 'containerGroups', shipment);
  const transportType = getByPathWithDefault('', 'transportType', shipment);
  const containers = getByPathWithDefault([], 'containers', shipment);
  const dischargePort = voyages[voyages.length - 1].arrivalPort;

  const haveContainer = containers && containers.length > 0;
  const { warehouse } = haveContainer ? containers[0] : containerGroups[0];

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

      <div className={haveContainer ? WarehouseNameWrapperStyle : PortNameWrapperStyle}>
        <TimelineWarehouseName name={warehouse && warehouse.name} containers={containers} />
      </div>

      <div className={BlankSpaceStyle} />
    </div>
  );
};

export default HorizontalPortNames;
