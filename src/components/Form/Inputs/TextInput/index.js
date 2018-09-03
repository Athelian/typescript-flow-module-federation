// @flow
import * as React from 'react';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

const TextInput = ({ align, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="text" spellCheck={false} />
);

TextInput.defaultProps = defaultInputProps;

export default TextInput;
