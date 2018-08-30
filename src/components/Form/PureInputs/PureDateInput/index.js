// @flow
import * as React from 'react';
import { formatToDateInput } from 'utils/date';
import { type PureDateInputProps as Props, defaultPureDateInputProps } from './type';

const PureDateInput = ({ align, value, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} value={formatToDateInput(value)} type="date" />
);

PureDateInput.defaultProps = defaultPureDateInputProps;

export default PureDateInput;
