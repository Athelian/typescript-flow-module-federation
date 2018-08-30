// @flow
import * as React from 'react';
import { type PurePasswordInputProps as Props, defaultPurePasswordInputProps } from './type';

const PurePasswordInput = ({ align, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="password" spellCheck={false} />
);

PurePasswordInput.defaultProps = defaultPurePasswordInputProps;

export default PurePasswordInput;
