// @flow
import * as React from 'react';

export type LabelProps = {
  required?: boolean,
  labelAlign?: 'left' | 'right' | 'center',
  labelWidth?: string,
};

export type TooltipProps = {
  hideTooltip?: boolean,
  isNew?: boolean,
  errorMessage?: string,
  warningMessage?: React.Node,
  infoMessage?: React.Node,
  originalValue?: any,
};

export type InputWrapperProps = {
  isFocused?: boolean,
  disabled?: boolean,
  forceHoverStyle?: boolean,
  inputWidth?: string,
  inputHeight?: string,
};

export type InputProps = {
  value?: any,
  name?: string,
  placeholder?: React.Node,
  onChange?: ?Function,
  onBlur?: ?Function,
  onFocus?: ?Function,
  inputAlign?: 'left' | 'right' | 'center',
  readOnly?: boolean,
};
