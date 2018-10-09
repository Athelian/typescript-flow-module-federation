// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { isSameDay } from 'date-fns';
import FormattedDate from 'components/FormattedDate';
import FormattedName from 'components/FormattedName';
import type { Event } from 'modules/history/components/EntityTimeline/type.js.flow';
import messages from 'modules/history/components/EntityTimeline/messages';
import { DefaultEventWrapperStyle, NameStyle, DateStyle, EventStyle } from './style';

type Props = {
  event: Event,
};

const DefaultEvent = ({ event }: Props) => (
  <div className={DefaultEventWrapperStyle}>
    <div className={DateStyle}>
      {isSameDay(new Date(), event.createdAt) ? (
        <FormattedDate value={event.createdAt} mode="time-relative" />
      ) : (
        <FormattedDate value={event.createdAt} mode="time" />
      )}
    </div>
    <div className={EventStyle}>
      <FormattedMessage
        {...messages.defaultEvent}
        values={{
          user: (
            <span className={NameStyle}>
              <FormattedName
                firstName={event.createdBy.firstName}
                lastName={event.createdBy.lastName}
              />
            </span>
          ),
        }}
      />
    </div>
  </div>
);

export default DefaultEvent;
