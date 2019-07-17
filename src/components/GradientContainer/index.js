// @flow
import * as React from 'react';
import { GradientStyle } from './style';

type Props = {
  className?: string,
  children: React.Node,
};

export default function GradientContainer({ className, children }: Props) {
  return <div className={`${GradientStyle} ${className || ''}`}>{children}</div>;
}
