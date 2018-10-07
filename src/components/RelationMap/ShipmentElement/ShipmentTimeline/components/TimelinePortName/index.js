// @flow
import * as React from 'react';
import { TimelinePortNameWrapperStyle } from './style';

type Props = {
  port: string,
  color: string,
};

const TimelinePort = ({ port, color }: Props) => (
  <div className={TimelinePortNameWrapperStyle({ color })}>{port}</div>
);

export default TimelinePort;
