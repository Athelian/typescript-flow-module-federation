// @flow
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { Link } from '@reach/router';
import { FormattedMessage } from 'react-intl';
// $FlowFixMe flow not yet configured
import { isSameDay } from 'date-fns';
import FormattedDate from 'components/FormattedDate';
import FormattedName from 'components/FormattedName';
import Icon from 'components/Icon';
import type { Event } from 'components/EntityTimeline/type.js.flow';
import messages from 'components/EntityTimeline/messages';
import {
  UpdateEventWrapperStyle,
  EventStyle,
  NameStyle,
  DateStyle,
  OldStyle,
  NewStyle,
  TargetStyle,
  FieldStyle,
} from './style';
import FormatValue from '../../helpers';

type Props = {
  event: Event,
  entityType: string,
  translateField: string => any,
  formatValue: (string, string) => any,
  targetToIdentifier: Object => string,
  onTargetClick: Object => void,
};

const UpdateEvent = ({
  event,
  entityType,
  translateField,
  formatValue,
  targetToIdentifier,
  onTargetClick,
}: Props) => (
  <div className={UpdateEventWrapperStyle}>
    <div className={DateStyle}>
      {isSameDay(new Date(), event.createdAt) ? (
        <FormattedDate value={event.createdAt} mode="time-relative" />
      ) : (
        <FormattedDate value={event.createdAt} mode="time" />
      )}
    </div>
    <div className={EventStyle}>
      <FormattedMessage
        {...(event.changes[0].oldValue ? messages.updateEvent : messages.updateEventSet)}
        values={{
          user: (
            <Link to={`/staff/${event.user.id}`} className={NameStyle}>
              <FormattedName firstName={event.user.firstName} lastName={event.user.lastName} />
              <Icon icon="EXTERNAL_LINK" />
            </Link>
          ),
          field: <span className={FieldStyle}>{translateField(event.changes[0].field)}</span>,
          target:
            entityType === event.target.__typename ? (
              ''
            ) : (
              <span
                role="link"
                tabIndex="0"
                className={TargetStyle}
                onClick={() => {
                  onTargetClick(event.target);
                }}
                onKeyDown={() => {
                  onTargetClick(event.target);
                }}
              >
                <FormattedMessage
                  {...messages[event.target.__typename]}
                  values={{
                    identifier: targetToIdentifier(event.target),
                  }}
                />
              </span>
            ),
          oldValue: (
            <span className={OldStyle}>
              <FormatValue value={formatValue(event.changes[0].field, event.changes[0].oldValue)} />
            </span>
          ),
          newValue: (
            <span className={NewStyle}>
              <FormatValue value={formatValue(event.changes[0].field, event.changes[0].newValue)} />
            </span>
          ),
        }}
      />
    </div>
  </div>
);

export default UpdateEvent;
