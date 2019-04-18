// @flow
import * as React from 'react';
import { distanceConvert, distanceMetrics } from 'utils/metric';
import MetricInputFactory from './index';
import { type MetricInputProps } from './type';

const distanceInputFactory = ({ ...rest }: MetricInputProps) => (
  <MetricInputFactory {...rest} metrics={distanceMetrics} convert={distanceConvert} />
);

export default distanceInputFactory;
