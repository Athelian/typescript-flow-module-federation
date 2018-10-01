// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
// $FlowFixMe flow not yet configured
import { isSameDay } from 'date-fns';
import FormattedDate from 'components/FormattedDate';
import FormattedName from 'components/FormattedName';
import type { Event } from 'components/EntityTimeline/type.js.flow';
import messages from 'components/EntityTimeline/messages';
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
            <Link to={`/staff/${event.user.id}`} className={NameStyle}>
              <FormattedName firstName={event.user.firstName} lastName={event.user.lastName} />
              <Icon icon="EXTERNAL_ICON" />
            </Link>
          ),
        }}
      />
    </div>
  </div>
);

export default DefaultEvent;
