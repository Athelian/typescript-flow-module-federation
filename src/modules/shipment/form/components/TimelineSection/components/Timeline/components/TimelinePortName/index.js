// @flow
import * as React from 'react';
import EnumProvider from 'providers/enum';
import { TimelinePortNameWrapperStyle } from './style';

type Props = {
  port: string,
  transportType: ?string,
};

const TimelinePort = ({ port, transportType }: Props) => {
  let transportTypeEnum = '';
  if (transportType === 'Sea') transportTypeEnum = 'Seaport';
  else if (transportType === 'Air') transportTypeEnum = 'Airport';

  return (
    <div className={TimelinePortNameWrapperStyle}>
      {transportType &&
        port && (
          <EnumProvider enumType={transportTypeEnum}>
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) return `Error!: ${error}`;

              const searchedPort = data.find(portInList => portInList.name === port);

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
