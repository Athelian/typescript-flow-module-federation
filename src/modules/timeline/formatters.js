/* eslint-disable class-methods-use-this,no-underscore-dangle */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import pluralize from 'pluralize';
import { camelCase } from 'lodash/fp';
import User from './components/User';
import type { LogItem } from './components/Log';
import { ARCHIVED, UNARCHIVED, UPDATE_FIELD } from './contants';
import { FieldStyle, ValueStyle } from './style';
import messages from './messages';

export interface LogFormatter {
  format(log: LogItem): any;
  support(translationKey: string): boolean;
}

export class DefaultUpdateFormatter implements LogFormatter {
  format(log: LogItem): * {
    const module =
      log.parameters.entity_type.charAt(0).toUpperCase() +
      pluralize(log.parameters.entity_type).slice(1);
    const fieldName = camelCase(log.parameters.field);

    if (log.parameters.old !== null) {
      return (
        <FormattedMessage
          {...messages.updateField}
          values={{
            user: <User user={log.createdBy} />,
            field: (
              <span className={FieldStyle}>
                <FormattedMessage
                  id={`modules.${module}.${fieldName}`}
                  defaultMessage={fieldName}
                />
              </span>
            ),
            oldValue: <span className={ValueStyle}>{log.parameters.old}</span>,
            newValue: <span className={ValueStyle}>{log.parameters.new}</span>,
          }}
        />
      );
    }

    return (
      <FormattedMessage
        {...messages.setField}
        values={{
          user: <User user={log.createdBy} />,
          field: (
            <span className={FieldStyle}>
              <FormattedMessage id={`modules.${module}.${fieldName}`} defaultMessage={fieldName} />
            </span>
          ),
          value: <span className={ValueStyle}>{log.parameters.new}</span>,
        }}
      />
    );
  }

  support(translationKey: string): boolean {
    return translationKey === UPDATE_FIELD;
  }
}

export class DefaultArchivedFormatter implements LogFormatter {
  format(log: LogItem): * {
    const entityType =
      log.entity.__typename.charAt(0).toLowerCase() + log.entity.__typename.slice(1);

    return (
      <FormattedMessage
        {...messages.archived}
        values={{
          user: <User user={log.createdBy} />,
          entityType: <FormattedMessage {...messages[entityType]} />,
        }}
      />
    );
  }

  support(translationKey: string): boolean {
    return translationKey === ARCHIVED;
  }
}

export class DefaultUnarchivedFormatter implements LogFormatter {
  format(log: LogItem): * {
    const entityType =
      log.entity.__typename.charAt(0).toLowerCase() + log.entity.__typename.slice(1);

    return (
      <FormattedMessage
        {...messages.unarchived}
        values={{
          user: <User user={log.createdBy} />,
          entityType: <FormattedMessage {...messages[entityType]} />,
        }}
      />
    );
  }

  support(translationKey: string): boolean {
    return translationKey === UNARCHIVED;
  }
}

const DefaultFormatters = [
  new DefaultUpdateFormatter(),
  new DefaultArchivedFormatter(),
  new DefaultUnarchivedFormatter(),
];

export default DefaultFormatters;
