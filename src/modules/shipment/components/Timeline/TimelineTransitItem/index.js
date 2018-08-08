// @flow
import * as React from 'react';
import type { ShipmentVoyageForm } from 'modules/shipment/type.js.flow';
import { getPortName } from 'modules/shipment/components/helpers';
import TimelineIcon from '../TimelineIcon';
import TimelineDate from '../TimelineDate';
import HorizontalLine from '../HorizontalLine';
import VoyageIcon from '../VoyageIcon';
import {
  TimelineTransitItemWrapperStyle,
  HeaderStyle,
  IconWrapperStyle,
  DatesWrapperStyle,
} from './style';

type Props = {
  transportType: ?string,
  leftVoyage: ShipmentVoyageForm,
  rightVoyage: ShipmentVoyageForm,
  leftColor: string,
  rightColor: string,
  portIndex: number,
  onClick: number => void,
};

const TimelineTransitItem = ({
  transportType,
  leftVoyage,
  rightVoyage,
  leftColor,
  rightColor,
  portIndex,
  onClick,
}: Props) => (
  <div className={TimelineTransitItemWrapperStyle}>
    <div className={HeaderStyle}>{getPortName(transportType, leftVoyage.arrivalPort)}</div>
    <div className={IconWrapperStyle}>
      <HorizontalLine color={leftColor} />
      <TimelineIcon icon="faTransit" color={leftColor} onClick={() => onClick(portIndex)} />
      <HorizontalLine color={rightColor} />
      <VoyageIcon
        transportType={transportType}
        color={rightColor}
        onClick={() => onClick(portIndex + 1)}
      />
    </div>
    <div className={DatesWrapperStyle}>
      <TimelineDate timelineDate={leftVoyage.arrivalDate} align="right" />
      <TimelineDate timelineDate={rightVoyage.departureDate} align="left" />
    </div>
  </div>
);

export default TimelineTransitItem;
