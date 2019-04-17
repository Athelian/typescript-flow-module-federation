// @flow
import * as React from 'react';
import { areaConvert, areaMetrics } from 'utils/metric';
import MetricInputFactory from './index';
import { type MetricInputProps } from './type';

const areaInputFactory = ({ ...rest }: MetricInputProps) => (
  <MetricInputFactory {...rest} metrics={areaMetrics} convert={areaConvert} />
);

export default areaInputFactory;
