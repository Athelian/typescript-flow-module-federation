// @flow
import * as React from 'react';

export type PureInputProps = {
  value: any,
  name: string,
  placeholder: string | React.Node,
  onChange: ?Function,
  onBlur: ?Function,
  onFocus: ?Function,
  align: 'left' | 'right' | 'center',
};

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
