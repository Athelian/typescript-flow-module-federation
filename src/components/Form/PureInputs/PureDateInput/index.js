// @flow
import * as React from 'react';
import { formatToDateInput } from 'utils/date';
import {
  type PureInputProps as Props,
  defaultPureInputProps,
} from 'components/Form/PureInputs/type';

const PureDateInput = ({ align, value, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} value={formatToDateInput(value)} type="date" />
);

PureDateInput.defaultProps = defaultPureInputProps;

export default PureDateInput;
