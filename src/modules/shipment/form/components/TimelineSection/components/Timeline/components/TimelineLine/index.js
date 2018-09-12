// @flow
import * as React from 'react';
import { TimelineLineStyle } from './style';

type OptionalProps = {
  vertical: boolean,
  color: string,
};

type Props = OptionalProps;

const defaultProps = {
  vertical: true,
  color: 'GRAY_LIGHT',
};

const TimelineLine = ({ vertical, color }: Props) => (
  <div className={TimelineLineStyle({ vertical, color })} />
);

TimelineLine.defaultProps = defaultProps;

export default TimelineLine;
