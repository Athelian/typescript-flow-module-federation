// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import { LabelWrapperStyle } from './style';

type OptionalProps = {
  required: boolean,
  align: 'left' | 'right' | 'center',
  width: string,
  className: string,
  color: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  className: '',
  required: false,
  align: 'left',
  width: '100%',
  color: '',
};

const Label = ({ required, align, width, children, className, color }: Props) => (
  <div className={cx(LabelWrapperStyle(align, width, color), className)}>
    {children}
    {required && ' *'}
  </div>
);

Label.defaultProps = defaultProps;

export default Label;
