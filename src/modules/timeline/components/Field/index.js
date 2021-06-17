// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import pluralize from 'pluralize';
import { camelCase, upperFirst } from 'lodash/fp';
import { FieldStyle } from './style';

type Props = {
  field: string,
  entityType: string,
  intl: IntlShape,
};

const Field = ({ field, entityType, intl }: Props) => {
  const pluralizedEntityType = pluralize(entityType);
  let module = upperFirst(camelCase(pluralizedEntityType));
  const fieldName = camelCase(field);

  if (module === 'Files') {
    module = 'Documents';
  }

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
