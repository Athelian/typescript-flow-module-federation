// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { isSameDay } from 'date-fns';
import FormattedDate from 'components/FormattedDate';
import FormattedName from 'components/FormattedName';
import { DefaultEventWrapperStyle, DateStyle, EventStyle } from './style';

type Props = {
  event: Object,
};

const DefaultEvent = ({ event }: Props) => {
  console.warn('event', event);
  return (
    <div className={DefaultEventWrapperStyle}>
      <div className={DateStyle}>
        {isSameDay(new Date(), event.createdAt) ? (
          <FormattedDate value={event.createdAt} mode="time-relative" />
        ) : (
          <FormattedDate value={event.createdAt} mode="time" />
        )}
      </div>
      <div className={EventStyle}>
        <FormattedName firstName={event.createdBy.firstName} lastName={event.createdBy.lastName} />
        <Icon icon="EXTERNAL_ICON" />
      </div>
      {JSON.stringify(event, null, 2)}
    </div>
  );
};

export default DefaultEvent;
