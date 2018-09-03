// @flow
import * as React from 'react';
import { formatToDateInput } from 'utils/date';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

const DateInput = ({ align, value, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} value={formatToDateInput(value)} type="date" />
);

DateInput.defaultProps = defaultInputProps;

export default DateInput;
