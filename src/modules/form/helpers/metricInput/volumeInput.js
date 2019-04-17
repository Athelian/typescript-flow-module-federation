// @flow
import * as React from 'react';
import { volumeConvert, volumeMetrics } from 'utils/metric';
import MetricInputFactory from './index';
import { type MetricInputProps } from './type';

const volumeInputFactory = ({ ...rest }: MetricInputProps) => (
  <MetricInputFactory {...rest} metrics={volumeMetrics} convert={volumeConvert} />
);

export default volumeInputFactory;
