/* eslint-disable class-methods-use-this,no-underscore-dangle */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { getByPathWithDefault } from 'utils/fp';
import User from './components/User';
import { ARCHIVED, UNARCHIVED, UPDATE_FIELD } from './contants';
import type { LogItem } from './types';
import messages from './messages';
import Value from './components/Value';
import Field from './components/Field';

export interface LogFormatter {
  format(log: LogItem): any;
  support(translationKey: string): boolean;
}

export class DefaultUpdateFormatter implements LogFormatter {
  format(log: LogItem): * {
    if (log.parameters.old !== null) {
      return (
        <FormattedMessage
          {...messages.updateField}
          values={{
            user: <User user={log.createdBy} />,
            field: (
              <Field
                field={log.parameters.field.string}
                entityType={log.parameters.entity_type.string}
              />
            ),
            oldValue: <Value value={log.parameters.old} />,
            newValue: <Value value={log.parameters.new} />,
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
            <Field
              field={getByPathWithDefault('', 'parameters.field.string', log)}
              entityType={getByPathWithDefault('', 'parameters.entity_type.string', log)}
            />
          ),
          value: <Value value={log.parameters.new} />,
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
