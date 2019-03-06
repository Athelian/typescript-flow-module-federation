// @flow
import * as React from 'react';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

const PasswordInput = ({ align, readOnlyWidth, readOnlyHeight, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="password" spellCheck={false} />
);

PasswordInput.defaultProps = defaultInputProps;

export default PasswordInput;
