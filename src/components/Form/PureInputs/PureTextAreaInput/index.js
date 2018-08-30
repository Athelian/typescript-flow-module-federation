// @flow
import * as React from 'react';
import { type PureTextInputProps as Props, defaultPureTextInputProps } from './type';

const PureTextInput = ({ setFocus, ...rest }: Props) => <textarea {...rest} spellCheck={false} />;

PureTextInput.defaultProps = defaultPureTextInputProps;

export default PureTextInput;
