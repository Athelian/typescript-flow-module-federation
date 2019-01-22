// @flow
import * as React from 'react';
import pluralize from 'pluralize';
import { get, camelCase } from 'lodash/fp';
import { FormattedMessage } from 'react-intl';
import { isSameDay } from 'date-fns';
import FormattedDate from 'components/FormattedDate';
import FormattedName from 'components/FormattedName';
import type { Event } from 'modules/history/components/EntityTimeline/type.js.flow';
import messages from 'modules/history/components/EntityTimeline/messages';
import {
  FormatValue,
  findTargetChanges,
} from 'modules/history/components/EntityTimeline/components/EventEntry/helpers';
import {
  UpdateEventWrapperStyle,
  EventStyle,
  NameStyle,
  DateStyle,
  OldStyle,
  NewStyle,
  FieldStyle,
  TargetStyle,
} from './style';

type Props = {
  event: Event,
  entityType: string,
};

const UpdateEvent = ({ event, entityType }: Props) => (
  <div className={UpdateEventWrapperStyle}>
    <div className={DateStyle}>
      {isSameDay(new Date(), new Date(event.createdAt)) ? (
        <FormattedDate value={event.createdAt} mode="time-relative" />
      ) : (
        <FormattedDate value={event.createdAt} mode="time" />
      )}
    </div>
    <div className={EventStyle}>
      <FormattedMessage
        {...(event.updates[0].oldValue ? messages.updateEvent : messages.updateEventSet)}
        values={{
          user: (
            <span className={NameStyle}>
              <FormattedName
                firstName={event.createdBy.firstName}
                lastName={event.createdBy.lastName}
              />
            </span>
          ),
          field: (
            <span className={FieldStyle}>
              <FormattedMessage
                id={`modules.${pluralize(get('entity.__typename', event.updates[0]))}.${camelCase(
                  event.updates[0].field
                )}`}
              />
            </span>
          ),
          target: <span className={TargetStyle}>{findTargetChanges(entityType, event)}</span>,
          oldValue: (
            <span className={OldStyle}>
              <FormatValue value={event.updates[0].oldValue} />
            </span>
          ),
          newValue: (
            <span className={NewStyle}>
              <FormatValue value={event.updates[0].newValue} />
            </span>
          ),
        }}
      />
    </div>
  </div>
);

export default UpdateEvent;
