// @flow
import * as React from 'react';
import { type PureTextAreaInputProps as Props, defaultPureTextAreaInputProps } from './type';

const PureTextAreaInput = ({ setFocus, ...rest }: Props) => (
  <textarea {...rest} spellCheck={false} />
);

PureTextAreaInput.defaultProps = defaultPureTextAreaInputProps;

export default PureTextAreaInput;
