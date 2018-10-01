// @flow
import * as React from 'react';
import type { Entry } from './type.js.flow';
import EventEntry from './components/EventEntry';
import DateDivider from './components/DateDivider';
import { WrapperStyle, TimelineStyle } from './style';

type Props = {
  entityType: string,
  entry: Entry,
  showDayHeader: boolean,
};

const EntityTimeline = ({ entityType, entry, showDayHeader }: Props) => (
  <div className={WrapperStyle}>
    <div className={TimelineStyle}>
      {showDayHeader && <DateDivider date={entry.createdAt} />}
      <EventEntry event={entry} entityType={entityType} />
    </div>
  </div>
);

export default EntityTimeline;
