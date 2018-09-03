// @flow
import * as React from 'react';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

const TextAreaInput = ({ align, ...rest }: Props) => (
  <textarea style={{ textAlign: align }} {...rest} spellCheck={false} />
);

TextAreaInput.defaultProps = defaultInputProps;

export default TextAreaInput;
