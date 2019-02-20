// @flow
import * as React from 'react';

type OptionalProps = {
  value: any,
  name: string,
  placeholder: React.Node,
  onChange: ?Function,
  onBlur: ?Function,
  onFocus: ?Function,
  align: 'left' | 'right' | 'center',
  readOnly: boolean,
  readOnlyWidth: string,
  readOnlyHeight: string,
};

export type InputProps = OptionalProps;

export const defaultInputProps = {
  value: '',
  name: '',
  placeholder: null,
  onChange: null,
  onBlur: null,
  onFocus: null,
  align: 'right',
  readOnly: false,
  readOnlyWidth: '200px',
  readOnlyHeight: '30px',
};

export default defaultInputProps;
