// @flow
import * as React from 'react';
import { TimelineVoyageWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

const TimelineVoyage = ({ children }: Props) => (
  <div className={TimelineVoyageWrapperStyle}>{children}</div>
);

export default TimelineVoyage;
