// @flow
import * as React from 'react';
import { LabelWrapperStyle } from './style';

export type Props = {
  required?: boolean,
  children: React.Node,
};

const defaultProps = {
  required: false,
};

const Label = ({ required, children }: Props) => (
  <div className={LabelWrapperStyle}>
    {children}
    {required && ' *'}
  </div>
);

Label.defaultProps = defaultProps;
export default Label;
