// @flow
import * as React from 'react';
import type { Port, TransportType } from 'generated/graphql';
import { getPortName } from 'utils/shipment';
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
    <div className={TimelinePortNameWrapperStyle(vertical)}>
      {getPortName(transportTypeEnum, correctPort)}
    </div>
  );
};

TimelinePort.defaultProps = defaultProps;

export default TimelinePort;
