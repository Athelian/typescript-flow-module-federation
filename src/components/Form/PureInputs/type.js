// @flow
import * as React from 'react';

export type PureInputProps = {
  value?: any,
  name?: string,
  placeholder?: string | React.Node,
  onChange?: Function,
  onBlur?: Function,
  onFocus?: Function,
  setFocus: Function,
  setBlur: Function,
  align?: 'left' | 'right' | 'center',
};

export const pureInputDefaultProps = {
  value: null,
  name: '',
  placeholder: '',
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  align: 'right',
};

export default pureInputDefaultProps;
