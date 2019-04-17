// @flow
export const weightMetrics = ['g', 'kg', 'ton'];
export const volumeMetrics = ['cm³', 'm³'];
export const distanceMetrics = ['cm', 'm'];

export const convertDistanceUnit = (value: number, metric: string, newMetric: string) => {
  if (metric === 'm' && newMetric === 'cm') return value * 100;
  if (metric === 'cm' && newMetric === 'm') return value / 100;
  return value;
};

export const convertVolumeUnit = (value: number, metric: string, newMetric: string) => {
  if (metric === 'm³' && newMetric === 'cm³') return value * 1e6;
  if (metric === 'cm³' && newMetric === 'm³') return value / 1e6;
  return value;
};

export const convertWeightUnit = (value: number, metric: string, newMetric: string) => {
  if ((metric === 'g' && newMetric === 'kg') || (metric === 'kg' && newMetric === 'ton'))
    return value / 1e3;
  if ((metric === 'kg' && newMetric === 'g') || (metric === 'ton' && newMetric === 'kg'))
    return value * 1e3;
  if (metric === 'g' && newMetric === 'ton') return value / 1e6;
  if (metric === 'ton' && newMetric === 'g') return value * 1e6;
  return value;
};
