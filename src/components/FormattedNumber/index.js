// @flow
import * as React from 'react';
import { FormattedNumber as FormattedNumberIntl } from 'react-intl';

type Props = {|
  value: ?number | '',
  suffix?: ?string,
  prefix?: ?string,
|};

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
