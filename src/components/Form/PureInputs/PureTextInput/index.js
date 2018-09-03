// @flow
import * as React from 'react';
import {
  type PureInputProps as Props,
  defaultPureInputProps,
} from 'components/Form/PureInputs/type';

const PureTextInput = ({ align, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="text" spellCheck={false} />
);

PureTextInput.defaultProps = defaultPureInputProps;

export default PureTextInput;
