// @flow
import * as React from 'react';
import { LabelWrapperStyle } from './style';

type OptionalProps = {
  required: boolean,
  align: 'left' | 'right' | 'center',
  width: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  required: false,
  align: 'left',
  width: '100%',
};

const Label = ({ required, align, width, children }: Props) => (
  <div className={LabelWrapperStyle(align, width)}>
    {children}
    {required && ' *'}
  </div>
);

Label.defaultProps = defaultProps;

export default Label;
