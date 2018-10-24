// @flow
import * as React from 'react';
import { type MetricValue } from 'components/Form/Inputs/MetricInput/type';

export type MetricInputProps = {
  required?: boolean,
  align?: string,
  width?: string,
  height?: string,
  calculate?: Function,
  isNew: boolean,
  label: React.Node,
  inputHandlers: {
    name: string,
    value: MetricValue,
    isTouched: boolean,
    errorMessage: string,
    isFocused: boolean,
    onChange: Function,
    onFocus: Function,
    onBlur: Function,
  },
  originalValue: MetricValue,
};
