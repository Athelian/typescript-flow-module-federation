// @flow
import * as React from 'react';
import MetricInputFactory from './index';
import { type MetricInputProps } from './type';

const metrics = ['cm²', 'm²'];

const convert = (value: number, metric: string, newMetric: string) => {
  if (metric === 'm²' && newMetric === 'cm²') return value * 1e4;
  if (metric === 'cm²' && newMetric === 'm²') return value / 1e4;
  return value;
};

const areaInputFactory = ({ ...rest }: MetricInputProps) => (
  <MetricInputFactory {...rest} metrics={metrics} convert={convert} />
);

export default areaInputFactory;
