// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { Violation } from 'types';
import messages from './messages';

type Props = {
  violation: Violation,
};

const FormattedViolation = ({ violation }: Props) => {
  if (!messages[violation.error]) {
    return violation.message || violation.error;
  }

  return (
    <FormattedMessage
      {...messages[violation.error]}
      values={violation.parameters.reduce(
        (parameters, parameter) => ({
          ...parameters,
          [parameter.key]: parameter.value,
        }),
        {}
      )}
    />
  );
};

export default FormattedViolation;
