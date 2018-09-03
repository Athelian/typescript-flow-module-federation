// @flow
import * as React from 'react';
import {
  type PureInputProps as Props,
  defaultPureInputProps,
} from 'components/Form/PureInputs/type';

const PureTextAreaInput = ({ align, ...rest }: Props) => (
  <textarea style={{ textAlign: align }} {...rest} spellCheck={false} />
);

PureTextAreaInput.defaultProps = defaultPureInputProps;

export default PureTextAreaInput;
