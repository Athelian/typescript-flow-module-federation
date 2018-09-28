// @flow
import * as React from 'react';
import { TimelineVoyageWrapperStyle } from './style';

type OptionalProps = {
  vertical: boolean,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  vertical: false,
};

const TimelineVoyage = ({ vertical, children }: Props) => (
  <div className={TimelineVoyageWrapperStyle(vertical)}>{children}</div>
);

TimelineVoyage.defaultProps = defaultProps;

export default TimelineVoyage;
