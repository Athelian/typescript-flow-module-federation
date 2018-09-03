// @flow
import * as React from 'react';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

const EmailInput = ({ align, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="email" spellCheck={false} />
);

EmailInput.defaultProps = defaultInputProps;

export default EmailInput;
