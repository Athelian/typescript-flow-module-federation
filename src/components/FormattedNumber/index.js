// @flow
import * as React from 'react';
import { FormattedNumber as FormattedNumberIntl } from 'react-intl';

type Props = {
  value: ?number,
};

const FormattedNumber = ({ value }: Props) =>
  value !== null && value !== undefined ? <FormattedNumberIntl value={value} /> : '';

export default FormattedNumber;
