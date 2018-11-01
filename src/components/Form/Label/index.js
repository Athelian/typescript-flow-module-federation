// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import { LabelWrapperStyle } from './style';

type OptionalProps = {
  required: boolean,
  align: 'left' | 'right' | 'center',
  width: string,
  className: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  className: '',
  required: false,
  align: 'left',
  width: '100%',
};

const Label = ({ required, align, width, children, className }: Props) => (
  <div className={cx(LabelWrapperStyle(align, width), className)}>
    {children}
    {required && ' *'}
  </div>
);

Label.defaultProps = defaultProps;

export default Label;
