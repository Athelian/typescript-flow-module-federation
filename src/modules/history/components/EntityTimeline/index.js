// @flow
import * as React from 'react';
import type { Entry } from './type.js.flow';
import EventEntry from './components/EventEntry';
import { WrapperStyle, TimelineStyle } from './style';

type Props = {
  entityType: string,
  entry: Entry,
};

const EntityTimeline = ({ entityType, entry }: Props) => (
  <div className={WrapperStyle}>
    <div className={TimelineStyle}>
      <EventEntry event={entry} entityType={entityType} />
    </div>
  </div>
);

export default EntityTimeline;
