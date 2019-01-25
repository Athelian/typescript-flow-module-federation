// @flow
import * as React from 'react';
import { TimelineLineStyle } from './style';

type OptionalProps = {
  vertical: boolean,
  color: string,
  flex: string,
};

type Props = OptionalProps;

const defaultProps = {
  vertical: false,
  color: 'GRAY_LIGHT',
  flex: '1',
};

const TimelineLine = ({ vertical, color, flex }: Props) => (
  <div className={TimelineLineStyle({ vertical, color, flex })} />
);

TimelineLine.defaultProps = defaultProps;

export default TimelineLine;
