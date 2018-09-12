// @flow
import * as React from 'react';
import { TimelineIcon, TimelineLine } from '../components';
import { TimelineWrapperStyle, TimelineLeftWrapperStyle, TimelineRightWrapperStyle } from './style';

const VerticalTimeline = () => (
  <div className={TimelineWrapperStyle}>
    <div className={TimelineLeftWrapperStyle}>
      <TimelineIcon icon="CARGO_READY" color="GRAY_LIGHT" />
      <TimelineLine color="GRAY_LIGHT" />
    </div>
    <div className={TimelineRightWrapperStyle}>Hi</div>
  </div>
);

export default VerticalTimeline;
