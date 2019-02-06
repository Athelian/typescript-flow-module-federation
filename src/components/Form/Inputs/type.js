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
  width?: string, // only applies when readOnly is true, if you want to set width normally do it to the styled wrapper component
};

export type InputProps = OptionalProps;

export const defaultInputProps = {
  value: '',
  name: '',
  placeholder: '',
  onChange: null,
  onBlur: null,
  onFocus: null,
  align: 'right',
  readOnly: false,
};

export default defaultInputProps;
