// @flow
import * as React from 'react';
import {
  type PureInputProps as Props,
  defaultPureInputProps,
} from 'components/Form/PureInputs/type';

const PurePasswordInput = ({ align, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="password" spellCheck={false} />
);

PurePasswordInput.defaultProps = defaultPureInputProps;

export default PurePasswordInput;
