// @flow
import * as React from 'react';
import { VerticalTimeline } from './components/Timeline';
import DateSection from './components/DateSection';
import { TimelineSectionWrapperStyle, TimelineWrapperStyle, BodyWrapperStyle } from './style';

type Props = {
  isNew: boolean,
};

const TimelineSection = ({ isNew }: Props) => (
  <div className={TimelineSectionWrapperStyle}>
    <div className={TimelineWrapperStyle}>
      <VerticalTimeline />
    </div>
    <div className={BodyWrapperStyle}>
      <DateSection isNew={isNew} icon="CARGO_READY" title="CARGO READY" />
      <DateSection isNew={isNew} icon="PORT" title="LOAD PORT DEPARTURE" />
      <DateSection isNew={isNew} icon="PORT" title="DISCHARGE PORT ARRIVAL" />
      <DateSection isNew={isNew} icon="CUSTOMS" title="CUSTOMS CLEARANCE" />
      <DateSection isNew={isNew} icon="WAREHOUSE" title="WAREHOUSE ARRIVAL" />
      <DateSection isNew={isNew} icon="DELIVERY_READY" title="DELIVERY READY" />
    </div>
  </div>
);

export default TimelineSection;
