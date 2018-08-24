// @flow
import * as React from 'react';

export type PureInputOptionalProps = {
  value: any,
  name: string,
  placeholder: string | React.Node,
  onChange: ?Function,
  onBlur: ?Function,
  onFocus: ?Function,
  align: 'left' | 'right' | 'center',
};

export type PureInputRequiredProps = {
  setFocus: (value: boolean) => void,
};

export const defaultPureInputProps = {
  value: null,
  name: '',
  placeholder: '',
  onChange: null,
  onBlur: null,
  onFocus: null,
  align: 'right',
};

export default defaultPureInputProps;
