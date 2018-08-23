// @flow
import * as React from 'react';
import { type LabelProps, defaultLabelProps } from './type';
import { LabelWrapperStyle } from './style';

type Props = LabelProps & {
  children: React.Node,
};

const Label = ({ required, children }: Props) => (
  <div className={LabelWrapperStyle}>
    {children}
    {required && ' *'}
  </div>
);

Label.defaultProps = defaultLabelProps;

export default Label;
