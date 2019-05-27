// @flow
import { times, divide } from 'number-precision';

export const distanceMetrics = ['cm', 'm'];
export const areaMetrics = ['cm²', 'm²'];
export const volumeMetrics = ['cm³', 'm³'];
export const weightMetrics = ['g', 'kg', 'ton'];
export const durationMetrics = ['days', 'weeks', 'months'];

export const defaultDistanceMetric = distanceMetrics[0]; // cm
export const defaultAreaMetric = areaMetrics[1]; // m²
export const defaultVolumeMetric = volumeMetrics[1]; // m³
export const defaultWeightMetric = weightMetrics[1]; // kg
export const defaultDurationMetric = durationMetrics[0]; // days

export const convertDistance = (value: number, metric: 'cm' | 'm', newMetric: 'cm' | 'm') => {
  if (metric === 'm' && newMetric === 'cm') return times(value, 100);
  if (metric === 'cm' && newMetric === 'm') return divide(value, 100);
  return value;
};

export const convertArea = (value: number, metric: 'cm²' | 'm²', newMetric: 'cm²' | 'm²') => {
  if (metric === 'm²' && newMetric === 'cm²') return times(value, 10000);
  if (metric === 'cm²' && newMetric === 'm²') return divide(value, 10000);
  return value;
};

export const convertVolume = (value: number, metric: 'cm³' | 'm³', newMetric: 'cm³' | 'm³') => {
  if (metric === 'm³' && newMetric === 'cm³') return times(value, 1000000);
  if (metric === 'cm³' && newMetric === 'm³') return divide(value, 1000000);
  return value;
};

export const convertWeight = (
  value: number,
  metric: 'g' | 'kg' | 'ton',
  newMetric: 'g' | 'kg' | 'ton'
) => {
  if ((metric === 'g' && newMetric === 'kg') || (metric === 'kg' && newMetric === 'ton'))
    return divide(value, 1000);
  if ((metric === 'kg' && newMetric === 'g') || (metric === 'ton' && newMetric === 'kg'))
    return times(value, 1000);
  if (metric === 'g' && newMetric === 'ton') return divide(value, 1000000);
  if (metric === 'ton' && newMetric === 'g') return times(value, 1000000);
  return value;
};
