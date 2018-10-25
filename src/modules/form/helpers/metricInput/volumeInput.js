// @flow
import * as React from 'react';
import MetricInputFactory from './index';
import { type MetricInputProps } from './type';

const metrics = ['cm³', 'm³'];

const convert = (value: number, metric: string, newMetric: string) => {
  if (metric === 'm³' && newMetric === 'cm³') return value * 1e6;
  if (metric === 'cm³' && newMetric === 'm³') return value / 1e6;
  return value;
};

const volumeInputFactory = ({ ...rest }: MetricInputProps) => (
  <MetricInputFactory {...rest} metrics={metrics} convert={convert} />
);

export default volumeInputFactory;
