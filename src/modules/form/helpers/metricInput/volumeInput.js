// @flow
import * as React from 'react';
import { times, divide } from 'number-precision';
import MetricInputFactory from './index';
import { type MetricInputProps } from './type';

export const metrics = ['cm³', 'm³'];

export const convert = (value: number, metric: string, newMetric: string) => {
  if (metric === 'm³' && newMetric === 'cm³') return times(value, 1000000);
  if (metric === 'cm³' && newMetric === 'm³') return divide(value, 1000000);
  return value;
};

const volumeInputFactory = ({ ...rest }: MetricInputProps) => (
  <MetricInputFactory {...rest} metrics={metrics} convert={convert} />
);

export default volumeInputFactory;
