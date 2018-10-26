// @flow
import * as React from 'react';
import MetricInputFactory from './index';
import { type MetricInputProps } from './type';

const metrics = ['g', 'kg', 'ton'];

const convert = (value: number, metric: string, newMetric: string) => {
  if ((metric === 'g' && newMetric === 'kg') || (metric === 'kg' && newMetric === 'ton'))
    return value / 1e3;
  if ((metric === 'kg' && newMetric === 'g') || (metric === 'ton' && newMetric === 'kg'))
    return value * 1e3;
  if (metric === 'g' && newMetric === 'ton') return value / 1e6;
  if (metric === 'ton' && newMetric === 'g') return value * 1e6;
  return value;
};

const weightInputFactory = ({ ...rest }: MetricInputProps) => (
  <MetricInputFactory {...rest} metrics={metrics} convert={convert} />
);

export default weightInputFactory;
