// @flow
import * as React from 'react';
import { TimelineLineStyle } from './style';

type OptionalProps = {
  vertical: boolean,
  color: string,
  size?: number,
};

type Props = OptionalProps;

const defaultProps = {
  vertical: false,
  color: 'GRAY_LIGHT',
};

const TimelineLine = ({ vertical, color, size }: Props) => (
  <div className={TimelineLineStyle({ vertical, color, size })} />
);

TimelineLine.defaultProps = defaultProps;

export default TimelineLine;
