// @flow
import * as React from 'react';
import { times, divide } from 'number-precision';
import MetricInputFactory from './index';
import { type MetricInputProps } from './type';

export const metrics = ['cm²', 'm²'];

export const convert = (value: number, metric: string, newMetric: string) => {
  if (metric === 'm²' && newMetric === 'cm²') return times(value, 10000);
  if (metric === 'cm²' && newMetric === 'm²') return divide(value, 10000);
  return value;
};

const areaInputFactory = ({ ...rest }: MetricInputProps) => (
  <MetricInputFactory {...rest} metrics={metrics} convert={convert} />
);

export default areaInputFactory;
