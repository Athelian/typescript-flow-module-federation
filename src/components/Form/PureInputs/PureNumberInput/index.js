// @flow
import * as React from 'react';
import { type PureNumberInputProps as Props, defaultPureNumberInputProps } from './type';

const PureNumberInput = ({ align, setFocus, ...rest }: Props) => (
  <input style={{ textAlign: align }} {...rest} type="number" spellCheck={false} />
);

PureNumberInput.defaultProps = defaultPureNumberInputProps;

export default PureNumberInput;
