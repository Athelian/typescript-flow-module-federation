// @flow
import * as React from 'react';

export type InputProps = {|
  value: any,
  name: string,
  placeholder: ?React.Node,
  inputRef?: Object,
  onChange: ?Function,
  onBlur: ?Function,
  onFocus: ?Function,
  align: 'left' | 'right' | 'center',
  readOnly: boolean,
  readOnlyWidth: string,
  readOnlyHeight: string,
|};

export const defaultInputProps = {
  value: '',
  name: '',
  placeholder: null,
  onChange: null,
  onBlur: null,
  onFocus: null,
  align: 'left',
  readOnly: false,
  readOnlyWidth: '200px',
  readOnlyHeight: '30px',
};

export default defaultInputProps;
