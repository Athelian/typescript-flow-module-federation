// @flow
import * as React from 'react';
import { type LabelProps as Props, labelDefaultProps } from './type';
import { LabelWrapperStyle } from './style';

const Label = ({ required, children }: Props) => (
  <div className={LabelWrapperStyle}>
    {children}
    {required && ' *'}
  </div>
);

Label.defaultProps = labelDefaultProps;

export default Label;
