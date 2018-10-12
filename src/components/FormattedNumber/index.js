// @flow
import * as React from 'react';
import { FormattedNumber as FormattedNumberIntl } from 'react-intl';

type OptionalProps = {
  suffix?: ?string,
  prefix?: ?string,
};

type Props = OptionalProps & {
  value: ?number,
};

const FormattedNumber = ({ value, suffix, prefix }: Props) => (
  <>
    {prefix ? `${prefix} ` : ''}
    {value !== null && value !== undefined ? <FormattedNumberIntl value={value} /> : ''}
    {suffix ? ` ${suffix}` : ''}
  </>
);

export default FormattedNumber;
