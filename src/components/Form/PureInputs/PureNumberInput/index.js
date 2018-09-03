// @flow
import * as React from 'react';
import {
  type PureInputProps as Props,
  defaultPureInputProps,
} from 'components/Form/PureInputs/type';

const PureNumberInput = ({ align, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="number" spellCheck={false} />
);

PureNumberInput.defaultProps = defaultPureInputProps;

export default PureNumberInput;
