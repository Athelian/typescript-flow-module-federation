// @flow
import * as React from 'react';
import { Display } from 'components/Form';
import { formatToDateInput } from 'utils/date';
import FormattedDate from 'components/FormattedDate';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

const DateInput = ({ value, align, readOnly, readOnlyWidth, readOnlyHeight, ...rest }: Props) => {
  return readOnly ? (
    <Display style={{ textAlign: align }} width={readOnlyWidth} height={readOnlyHeight}>
      <FormattedDate value={value} />
    </Display>
  ) : (
    <input
      value={value ? formatToDateInput(value) : ''}
      style={{ textAlign: align }}
      {...rest}
      type="date"
    />
  );
};

DateInput.defaultProps = defaultInputProps;

export default DateInput;
