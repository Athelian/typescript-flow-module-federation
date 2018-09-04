// @flow
import * as React from 'react';
import { FieldItemWrapperStyle, TooltipAbsoluteWrapperStyle } from './style';

type OptionalProps = {
  vertical: boolean,
  tooltip: React.Node,
};

type Props = OptionalProps & {
  label: React.Node,
  input: React.Node,
};

const defaultProps = {
  vertical: false,
};

const FieldItem = ({ vertical, tooltip, label, input }: Props) => (
  <div className={FieldItemWrapperStyle(vertical)}>
    {tooltip && <div className={TooltipAbsoluteWrapperStyle}>{tooltip}</div>}
    {label}
    {input}
  </div>
);

FieldItem.defaultProps = defaultProps;

export default FieldItem;
