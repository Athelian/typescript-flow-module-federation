// @flow
import * as React from 'react';
import CommentEntry from './components/CommentEntry';
import EventEntry from './components/EventEntry';
import DateDivider from './components/DateDivider';
import { WrapperStyle, TimelineStyle } from './style';

type OptionalProps = {
  commentHandlers: Object,
};

type Props = OptionalProps & {
  entityType: string,
  entryType: string,
  entry: Object,
  showDayHeader: boolean,
  hideAvatar: boolean,
};

const defaultProps = {
  commentHandlers: {},
};

const EntityTimeline = ({
  entityType,
  entry,
  entryType,
  commentHandlers,
  showDayHeader,
  hideAvatar,
}: Props) => (
  <div className={WrapperStyle}>
    <div className={TimelineStyle}>
      {showDayHeader && <DateDivider date={entry.createdAt} />}
      {entryType === 'EventChange' ? (
        <EventEntry event={entry} entityType={entityType} />
      ) : (
        <CommentEntry comment={entry} hideAvatar={hideAvatar} {...commentHandlers} />
      )}
    </div>
  </div>
);

EntityTimeline.defaultProps = defaultProps;

export default EntityTimeline;
