// @flow
import { times, divide } from 'number-precision';

export const distanceMetrics = ['cm', 'm'];
export const areaMetrics = ['cm²', 'm²'];
export const volumeMetrics = ['cm³', 'm³'];
export const weightMetrics = ['g', 'kg', 'ton'];
export const durationMetrics = ['days', 'weeks', 'months'];

export const convertDistance = (value: number, metric: string, newMetric: string) => {
  if (metric === 'm' && newMetric === 'cm') return times(value, 100);
  if (metric === 'cm' && newMetric === 'm') return divide(value, 100);
  return value;
};

export const convertArea = (value: number, metric: string, newMetric: string) => {
  if (metric === 'm²' && newMetric === 'cm²') return times(value, 10000);
  if (metric === 'cm²' && newMetric === 'm²') return divide(value, 10000);
  return value;
};

export const convertVolume = (value: number, metric: string, newMetric: string) => {
  if (metric === 'm³' && newMetric === 'cm³') return times(value, 1000000);
  if (metric === 'cm³' && newMetric === 'm³') return divide(value, 1000000);
  return value;
};

export const weightConvert = (value: number, metric: string, newMetric: string) => {
  if ((metric === 'g' && newMetric === 'kg') || (metric === 'kg' && newMetric === 'ton'))
    return divide(value, 1000);
  if ((metric === 'kg' && newMetric === 'g') || (metric === 'ton' && newMetric === 'kg'))
    return times(value, 1000);
  if (metric === 'g' && newMetric === 'ton') return divide(value, 1000000);
  if (metric === 'ton' && newMetric === 'g') return times(value, 1000000);
  return value;
};
