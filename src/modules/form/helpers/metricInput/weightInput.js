// @flow
import * as React from 'react';
import { weightConvert, weightMetrics } from 'utils/metric';
import MetricInputFactory from './index';
import { type MetricInputProps } from './type';

const weightInputFactory = ({ ...rest }: MetricInputProps) => (
  <MetricInputFactory {...rest} metrics={weightMetrics} convert={weightConvert} />
);

export default weightInputFactory;
