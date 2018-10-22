// @flow
import * as React from 'react';
import { get } from 'lodash/fp';
import { FormattedMessage } from 'react-intl';
import { isSameDay } from 'date-fns';
import FormattedDate from 'components/FormattedDate';
import FormattedName from 'components/FormattedName';
import Icon from 'components/Icon';
import logger from 'utils/logger';
import type { Event } from 'modules/history/components/EntityTimeline/type.js.flow';
import messages from 'modules/history/components/EntityTimeline/messages';
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
};

type State = {
  isExpanded: boolean,
};

export default class MultipleUpdateEvent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isExpanded: props.event.updates.length <= 3,
    };
  }

  toggle = () => {
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
  };

  render() {
    const { event, entityType } = this.props;
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
                  <span className={NameStyle}>
                    <FormattedName
                      firstName={event.createdBy.firstName}
                      lastName={event.createdBy.lastName}
                    />
                  </span>
                ),
                target:
                  entityType === get('__typename', event.target) ? (
                    ''
                  ) : (
                    <span
                      role="link"
                      tabIndex="0"
                      className={TargetStyle}
                      onClick={e => {
                        e.stopPropagation();
                        logger.warn(event.target);
                      }}
                      onKeyDown={e => {
                        e.stopPropagation();
                        logger.warn(event.target);
                      }}
                    >
                      {JSON.stringify(event.target)}
                    </span>
                  ),
                count: event.updates.length,
              }}
            />
          </div>
          <div className={ChevronStyle(isExpanded)}>
            <Icon icon="CHEVRON_DOWN" />
          </div>
        </button>
        {isExpanded && (
          <div className={UpdateListStyle}>
            {event.updates.map(change => (
              <div className={ChangeStyle} key={change.field}>
                <FormattedMessage
                  {...(change.oldValue
                    ? messages.multipleUpdateEventChange
                    : messages.multipleUpdateEventChangeSet)}
                  values={{
                    field: (
                      <span className={FieldStyle}>
                        <FormattedMessage id={`containers.${entityType}s.${change.field}`} />
                      </span>
                    ),
                    oldValue: (
                      <span className={OldStyle}>
                        <FormatValue value={change.oldValue} />
                      </span>
                    ),
                    newValue: (
                      <span className={NewStyle}>
                        <FormatValue value={change.newValue} />
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
