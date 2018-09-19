// @flow
import * as React from 'react';
import EnumProvider from 'providers/enum';
import { TimelinePortNameWrapperStyle } from './style';

type Props = {
  port: {
    seaport: string,
    airport: string,
  },
  transportType: ?string,
};

const TimelinePort = ({ port, transportType }: Props) => {
  let transportTypeEnum = '';
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
      {transportType &&
        correctPort && (
          <EnumProvider enumType={transportTypeEnum}>
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) return `Error!: ${error}`;

              const searchedPort = data.find(portInList => portInList.name === correctPort);

              if (searchedPort) {
                return searchedPort.description;
              }

              return 'Not found';
            }}
          </EnumProvider>
        )}
    </div>
  );
};

export default TimelinePort;
