// @flow
import * as React from 'react';
import { uniqBy } from 'lodash';
import EnumProvider from 'providers/enum';
import type { TimelineDatePayload } from 'generated/graphql';
import { getByPathWithDefault } from './fp';
import { initDatetimeToContainer, MIN_DATE_VALUE } from './date';

export const getLatestDate = (timelineDate: ?Object) => {
  if (!timelineDate) return null;

  const { date, timelineDateRevisions } = timelineDate;

  return timelineDateRevisions.length
    ? timelineDateRevisions
        .concat({ date: date || new Date(MIN_DATE_VALUE).toISOString() })
        .reduce((max, current) => (max.date > current.date ? max : current)).date
    : date;
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

export const initDatetimeToContainerForShipmentTimeline = (
  timelinePoint: ?TimelineDatePayload,
  timelinePointName: string,
  timezone: string
): Object => {
  return timelinePoint
    ? {
        [timelinePointName]: {
          ...timelinePoint,
          ...initDatetimeToContainer(timelinePoint?.date ?? null, 'date', timezone),
          ...initDatetimeToContainer(timelinePoint?.resultDate ?? null, 'resultDate', timezone),
          timelineDateRevisions: (timelinePoint?.timelineDateRevisions ?? []).map(revision => ({
            ...revision,
            ...initDatetimeToContainer(revision?.date ?? null, 'date', timezone),
          })),
        },
      }
    : {};
};
