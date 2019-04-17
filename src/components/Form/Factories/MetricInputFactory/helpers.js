// @flow
import {
  distanceConvert,
  areaConvert,
  weightConvert,
  volumeConvert,
  distanceMetrics,
  areaMetrics,
  volumeMetrics,
  weightMetrics,
  durationMetrics,
} from 'utils/metric';

export type MetricEnumType = 'distance' | 'area' | 'volume' | 'weight' | 'duration';

export const getMetrics = (metricType?: MetricEnumType): Array<string> => {
  if (metricType) {
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
  }

  return [];
};

export const getConvert = (metricType?: MetricEnumType): Function => {
  if (metricType) {
    switch (metricType) {
      case 'distance':
        return distanceConvert;
      case 'area':
        return areaConvert;
      case 'volume':
        return volumeConvert;
      case 'weight':
        return weightConvert;
      case 'duration':
        // No conversion
        return (value: number) => value;
      default:
        return (value: number) => value;
    }
  }

  return (value: number) => value;
};
