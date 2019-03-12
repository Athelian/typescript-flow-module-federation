/* eslint-disable class-methods-use-this */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import pluralize from 'pluralize';
import { camelCase } from 'lodash/fp';
import User from './components/User';
import { UPDATE_FIELD } from './contants';
import { NewValueStyle, OldValueStyle } from './style';
import messages from './messages';

export interface LogFormatter {
  format(
    translationKey: string,
    parameters: { [key: string]: any },
    entity: Object,
    user: Object
  ): any;
  support(translationKey: string): boolean;
}

export class DefaultUpdateFormatter implements LogFormatter {
  format(translationKey: string, parameters: { [p: string]: * }, entity: Object, user: Object): * {
    const module =
      parameters.entity_type.charAt(0).toUpperCase() + pluralize(parameters.entity_type).slice(1);
    const fieldName = camelCase(parameters.field);

    if (parameters.old !== null) {
      return (
        <FormattedMessage
          {...messages.updateField}
          values={{
            user: <User user={user} />,
            field: (
              <FormattedMessage id={`modules.${module}.${fieldName}`} defaultMessage={fieldName} />
            ),
            oldValue: <span className={OldValueStyle}>{parameters.old}</span>,
            newValue: <span className={NewValueStyle}>{parameters.new}</span>,
          }}
        />
      );
    }

    return (
      <FormattedMessage
        {...messages.setField}
        values={{
          user: <User user={user} />,
          field: (
            <FormattedMessage id={`modules.${module}.${fieldName}`} defaultMessage={fieldName} />
          ),
          value: <span className={NewValueStyle}>{parameters.new}</span>,
        }}
      />
    );
  }

  support(translationKey: string): boolean {
    return translationKey === UPDATE_FIELD;
  }
}

const DefaultFormatters = [new DefaultUpdateFormatter()];

export default DefaultFormatters;
