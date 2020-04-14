// @flow
import * as React from 'react';
import type { Port, TransportType } from 'generated/graphql';
import { getPortName } from 'utils/shipment';
import { FullValueTooltip } from 'components/Tooltip';
import { TimelinePortNameWrapperStyle } from './style';

type OptionalProps = {
  vertical: boolean,
};

type Props = OptionalProps & {
  port: Port,
  transportType: TransportType,
};

const defaultProps = {
  vertical: false,
};

const TimelinePort = ({ port, transportType, vertical }: Props) => {
  let transportTypeEnum = null;
  let correctPort = null;

  if (port) {
    if (transportType === 'Sea') {
      transportTypeEnum = 'Seaport';
      correctPort = port.seaport;
    } else if (transportType === 'Air') {
      transportTypeEnum = 'Airport';
      correctPort = port.airport;
    }
  }

  return (
    <FullValueTooltip message={getPortName(transportTypeEnum, correctPort)}>
      <div className={TimelinePortNameWrapperStyle(vertical)}>
        {getPortName(transportTypeEnum, correctPort)}
      </div>
    </FullValueTooltip>
  );
};

TimelinePort.defaultProps = defaultProps;

export default TimelinePort;
