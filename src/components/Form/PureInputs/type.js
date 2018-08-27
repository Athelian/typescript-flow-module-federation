// @flow
import * as React from 'react';

type OptionalProps = {
  value: any,
  name: string,
  placeholder: string | React.Node,
  onChange: ?Function,
  onBlur: ?Function,
  onFocus: ?Function,
  align: 'left' | 'right' | 'center',
};

export type PureInputProps = OptionalProps & {};

export const defaultPureInputProps = {
  value: '',
  name: '',
  placeholder: '',
  onChange: null,
  onBlur: null,
  onFocus: null,
  align: 'right',
};

export default defaultPureInputProps;
