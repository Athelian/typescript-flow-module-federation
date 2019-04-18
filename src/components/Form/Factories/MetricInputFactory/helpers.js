// @flow
import {
  convertDistance,
  convertArea,
  weightConvert,
  convertVolume,
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
        return convertDistance;
      case 'area':
        return convertArea;
      case 'volume':
        return convertVolume;
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
