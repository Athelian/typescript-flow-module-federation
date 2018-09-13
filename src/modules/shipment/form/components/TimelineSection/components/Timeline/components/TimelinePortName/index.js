// @flow
import * as React from 'react';
import { TimelinePortNameWrapperStyle } from './style';

type Props = {
  port: any,
};

const TimelinePort = ({ port }: Props) => (
  <div className={TimelinePortNameWrapperStyle}>{port}</div>
);

export default TimelinePort;
