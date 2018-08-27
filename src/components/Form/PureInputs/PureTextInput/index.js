// @flow
import * as React from 'react';
import { type PureTextInputProps as Props, defaultPureTextInputProps } from './type';

const PureTextInput = ({ align, setFocus, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="text" spellCheck={false} />
);

PureTextInput.defaultProps = defaultPureTextInputProps;

export default PureTextInput;
