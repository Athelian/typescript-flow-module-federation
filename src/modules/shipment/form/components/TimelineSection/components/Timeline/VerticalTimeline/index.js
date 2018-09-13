// @flow
import * as React from 'react';
import { TimelineIcon, TimelineLine } from '../components';
import { TimelineWrapperStyle, TimelineLeftWrapperStyle, TimelineRightWrapperStyle } from './style';

const VerticalTimeline = () => (
  <div className={TimelineWrapperStyle}>
    <div className={TimelineLeftWrapperStyle}>
      <TimelineIcon icon="CARGO_READY" color="GRAY_LIGHT" />

      <TimelineLine color="GRAY_LIGHT" />

      <TimelineIcon icon="PORT" color="GRAY_LIGHT" />

      <TimelineLine color="GRAY_LIGHT" />

      <TimelineIcon icon="PLANE" color="GRAY_LIGHT" />

      <TimelineLine color="GRAY_LIGHT" />

      <TimelineIcon icon="TRANSIT" color="GRAY_LIGHT" />

      <TimelineLine color="GRAY_LIGHT" />

      <TimelineIcon icon="PLANE" color="GRAY_LIGHT" />

      <TimelineLine color="GRAY_LIGHT" />

      <TimelineIcon icon="PORT" color="GRAY_LIGHT" />

      <TimelineLine color="GRAY_LIGHT" />

      <TimelineIcon icon="CUSTOMS" color="GRAY_LIGHT" />

      <TimelineLine color="GRAY_LIGHT" />

      <TimelineIcon icon="WAREHOUSE" color="GRAY_LIGHT" />

      <TimelineLine color="GRAY_LIGHT" />

      <TimelineIcon icon="DELIVERY_READY" color="GRAY_LIGHT" />
    </div>
    <div className={TimelineRightWrapperStyle}>Hi</div>
  </div>
);

export default VerticalTimeline;
