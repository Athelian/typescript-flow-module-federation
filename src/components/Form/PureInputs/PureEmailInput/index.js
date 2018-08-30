// @flow
import * as React from 'react';
import { type PureEmailInputProps as Props, defaultPureEmailInputProps } from './type';

const PureEmailInput = ({ align, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="email" spellCheck={false} />
);

PureEmailInput.defaultProps = defaultPureEmailInputProps;

export default PureEmailInput;
