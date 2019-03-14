// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import pluralize from 'pluralize';
import { camelCase } from 'lodash/fp';
import { FieldStyle } from './style';

type Props = {
  field: string,
  entityType: string,
};

const Field = ({ field, entityType }: Props) => {
  const pluralizedEntityType = pluralize(entityType);
  const module = pluralizedEntityType.charAt(0).toUpperCase() + pluralizedEntityType.slice(1);
  const fieldName = camelCase(field);

  return (
    <span className={FieldStyle}>
      <FormattedMessage id={`modules.${module}.${fieldName}`} defaultMessage={fieldName} />
    </span>
  );
};

export default Field;
