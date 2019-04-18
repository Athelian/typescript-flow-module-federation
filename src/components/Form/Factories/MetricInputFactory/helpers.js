// @flow
import {
  convertDistance,
  convertArea,
  convertWeight,
  convertVolume,
  distanceMetrics,
  areaMetrics,
  volumeMetrics,
  weightMetrics,
  durationMetrics,
} from 'utils/metric';

export type MetricEnumType = 'distance' | 'area' | 'volume' | 'weight' | 'duration';

export const getMetrics = (metricType?: MetricEnumType): Array<string> => {
  switch (metricType) {
    case 'distance':
      return distanceMetrics;
    case 'area':
      return areaMetrics;
    case 'volume':
      return volumeMetrics;
    case 'weight':
      return weightMetrics;
    case 'duration':
      return durationMetrics;
    default:
      return [];
  }
};

export const getConvert = (metricType?: MetricEnumType): Function => {
  switch (metricType) {
    case 'distance':
      return convertDistance;
    case 'area':
      return convertArea;
    case 'volume':
      return convertVolume;
    case 'weight':
      return convertWeight;
    default:
      return (value: number) => value;
  }
};
