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
import FormatValue from '../../helpers';
import {
  MultipleUpdateEventWrapperStyle,
  ButtonStyle,
  NameStyle,
  DateStyle,
  MessageStyle,
  ChevronStyle,
  ChangeStyle,
  NewStyle,
  OldStyle,
  UpdateListStyle,
  TargetStyle,
  FieldStyle,
} from './style';

type Props = {
  event: Event,
  entityType: string,
  translateField: string => any,
  formatValue: (string, string) => any,
  targetToIdentifier: Object => string,
  onTargetClick: Object => void,
};

type State = {
  isExpanded: boolean,
};

export default class MultipleUpdateEvent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isExpanded: props.event.changes.length <= 3,
    };
  }

  toggle = () => {
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
  };

  render() {
    const {
      event,
      translateField,
      formatValue,
      entityType,
      onTargetClick,
      targetToIdentifier,
    } = this.props;
    const { isExpanded } = this.state;

    return (
      <div className={MultipleUpdateEventWrapperStyle}>
        <button type="button" className={ButtonStyle} onClick={this.toggle}>
          <div className={DateStyle}>
            {isSameDay(new Date(), event.createdAt) ? (
              <FormattedDate value={event.createdAt} mode="time-relative" />
            ) : (
              <FormattedDate value={event.createdAt} mode="time" />
            )}
          </div>
          <div className={MessageStyle}>
            <FormattedMessage
              {...messages.multipleUpdateEvent}
              values={{
                user: (
                  <Link to={`/staff/${event.user.id}`} className={NameStyle}>
                    <FormattedName
                      firstName={event.user.firstName}
                      lastName={event.user.lastName}
                    />
                    <Icon icon="EXTERNAL_LINK" />
                  </Link>
                ),
                target:
                  entityType === event.target.__typename ? (
                    ''
                  ) : (
                    <span
                      role="link"
                      tabIndex="0"
                      className={TargetStyle}
                      onClick={e => {
                        e.stopPropagation();
                        onTargetClick(event.target);
                      }}
                      onKeyDown={e => {
                        e.stopPropagation();
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
                count: event.changes.length,
              }}
            />
          </div>
          <div className={ChevronStyle(isExpanded)}>
            <Icon icon="CHEVRON_DOWN" />
          </div>
        </button>
        {isExpanded && (
          <div className={UpdateListStyle}>
            {event.changes.map(change => (
              <div className={ChangeStyle} key={change.field}>
                <FormattedMessage
                  {...(change.oldValue
                    ? messages.multipleUpdateEventChange
                    : messages.multipleUpdateEventChangeSet)}
                  values={{
                    field: <span className={FieldStyle}>{translateField(change.field)}</span>,
                    oldValue: (
                      <span className={OldStyle}>
                        <FormatValue value={formatValue(change.field, change.oldValue)} />
                      </span>
                    ),
                    newValue: (
                      <span className={NewStyle}>
                        <FormatValue value={formatValue(change.field, change.newValue)} />
                      </span>
                    ),
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
