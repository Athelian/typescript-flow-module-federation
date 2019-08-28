// @flow
import * as React from 'react';

type OptionalProps = {
  value: any,
  name: string,
  placeholder: ?React.Node,
  inputRef: ?React.Ref<any>,
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
  inputRef: null,
  onChange: null,
  onBlur: null,
  onFocus: null,
  align: 'left',
  readOnly: false,
  readOnlyWidth: '200px',
  readOnlyHeight: '30px',
};

export default defaultInputProps;
