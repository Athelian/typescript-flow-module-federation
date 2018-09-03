// @flow
import * as React from 'react';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

const NumberInput = ({ align, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="number" spellCheck={false} />
);

NumberInput.defaultProps = defaultInputProps;

export default NumberInput;
