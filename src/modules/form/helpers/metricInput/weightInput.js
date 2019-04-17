// @flow
import * as React from 'react';
import { times, divide } from 'number-precision';
import MetricInputFactory from './index';
import { type MetricInputProps } from './type';

export const metrics = ['g', 'kg', 'ton'];

export const convert = (value: number, metric: string, newMetric: string) => {
  if ((metric === 'g' && newMetric === 'kg') || (metric === 'kg' && newMetric === 'ton'))
    return divide(value, 1000);
  if ((metric === 'kg' && newMetric === 'g') || (metric === 'ton' && newMetric === 'kg'))
    return times(value, 1000);
  if (metric === 'g' && newMetric === 'ton') return divide(value, 1000000);
  if (metric === 'ton' && newMetric === 'g') return times(value, 1000000);
  return value;
};

const weightInputFactory = ({ ...rest }: MetricInputProps) => (
  <MetricInputFactory {...rest} metrics={metrics} convert={convert} />
);

export default weightInputFactory;
