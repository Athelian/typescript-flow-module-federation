// @flow
import * as React from 'react';
import { FormattedNumber as FormattedNumberIntl } from 'react-intl';

type OptionalProps = {
  suffix?: ?string,
  prefix?: ?string,
};

type Props = OptionalProps & {
  value: ?number | '',
};

const FormattedNumber = ({ value, suffix, prefix, ...rest }: Props) => (
  <>
    {prefix && `${prefix} `}
    {value !== null && value !== undefined && value !== '' && (
      <FormattedNumberIntl value={value} {...rest} />
    )}
    {suffix && ` ${suffix}`}
  </>
);

export default FormattedNumber;
