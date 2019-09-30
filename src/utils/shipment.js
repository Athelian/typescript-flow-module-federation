// @flow
import * as React from 'react';
import { uniqBy } from 'lodash';
import EnumProvider from 'providers/enum';
import { getByPathWithDefault } from './fp';

export const getLatestDate = (timelineDate: ?Object) => {
  if (!timelineDate) return null;

  const { date, timelineDateRevisions } = timelineDate;

  const hasDateRevisions = timelineDateRevisions && timelineDateRevisions.length > 0;
  const latestDate = hasDateRevisions
    ? timelineDateRevisions[timelineDateRevisions.length - 1].date
    : date;

  return latestDate;
};

export const getPortName = (
  enumType: ?('Seaport' | 'Airport'),
  portValue: ?string | ?{ description: string }
): React.Node => {
  if (portValue && portValue.description) {
    return String(portValue.description);
  }

  if (enumType && portValue) {
    return (
      <EnumProvider enumType={enumType}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) return `Error!: ${error}`;

          const searchedPort = data.find(portInList => portInList.name === portValue);

          if (searchedPort) {
            return searchedPort.description;
          }

          return 'Not found';
        }}
      </EnumProvider>
    );
  }
  return null;
};

export const getUniqueExporters = (batches: Array<Object> = []) => {
  // $FlowFixMe need to change type from lodash
  const uniqueExporters = uniqBy(
    batches.map(batch => getByPathWithDefault({}, 'orderItem.productProvider.exporter', batch)),
    'id'
  );

  return uniqueExporters;
};

export const getPort = (transportType: ?string, port: Object = {}): string => {
  if (transportType) {
    if (transportType === 'Air') {
      return port.airportName || '';
    }
    if (transportType === 'Sea') {
      return port.seaportName || '';
    }
  }
  return '';
};
