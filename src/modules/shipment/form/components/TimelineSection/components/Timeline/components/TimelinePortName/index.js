// @flow
import * as React from 'react';
import { getPortName } from 'modules/shipment/form/components/TimelineSection/components/Timeline/helpers';
import { TimelinePortNameWrapperStyle } from './style';

type Props = {
  port: {
    seaport: string,
    airport: string,
  },
  transportType: ?string,
};

const TimelinePort = ({ port, transportType }: Props) => {
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
    <div className={TimelinePortNameWrapperStyle}>
      {getPortName(transportTypeEnum, correctPort)}
    </div>
  );
};

export default TimelinePort;
