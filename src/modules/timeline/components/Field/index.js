// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import pluralize from 'pluralize';
import { camelCase } from 'lodash/fp';
import { FieldStyle } from './style';

type Props = {
  field: string,
  entityType: string,
  intl: IntlShape,
};

const Field = ({ field, entityType, intl }: Props) => {
  const pluralizedEntityType = pluralize(entityType);
  const module = pluralizedEntityType.charAt(0).toUpperCase() + pluralizedEntityType.slice(1);
  const fieldName = camelCase(field);

  return (
    <span className={FieldStyle}>
      {intl.formatMessage({
        id: `modules.${module}.${fieldName}`,
        defaultMessage: fieldName,
      })}
    </span>
  );
};

export default injectIntl(Field);
