// @flow
import * as React from 'react';
import MetricInputFactory from './index';
import { type MetricInputProps } from './type';

export const metrics = ['cm', 'm'];

export const convert = (value: number, metric: string, newMetric: string) => {
  if (metric === 'm' && newMetric === 'cm') return value * 100;
  if (metric === 'cm' && newMetric === 'm') return value / 100;
  return value;
};

const distanceInputFactory = ({ ...rest }: MetricInputProps) => (
  <MetricInputFactory {...rest} metrics={metrics} convert={convert} />
);

export default distanceInputFactory;
