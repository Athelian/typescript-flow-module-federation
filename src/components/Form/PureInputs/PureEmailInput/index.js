// @flow
import * as React from 'react';
import {
  type PureInputProps as Props,
  defaultPureInputProps,
} from 'components/Form/PureInputs/type';

const PureEmailInput = ({ align, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="email" spellCheck={false} />
);

PureEmailInput.defaultProps = defaultPureInputProps;

export default PureEmailInput;
