// @flow
import * as React from 'react';
import { LabelWrapperStyle } from './style';

type OptionalProps = {
  required: boolean,
  align: 'left' | 'right' | 'center',
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  required: false,
  align: 'left',
};

const Label = ({ required, align, children }: Props) => (
  <div className={LabelWrapperStyle(align)}>
    {children}
    {required && ' *'}
  </div>
);

Label.defaultProps = defaultProps;

export default Label;
