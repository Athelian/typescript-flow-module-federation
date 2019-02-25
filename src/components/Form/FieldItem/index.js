// @flow
import * as React from 'react';
import { FieldItemWrapperStyle, TooltipAbsoluteWrapperStyle } from './style';

type OptionalProps = {
  vertical: boolean,
  verticalGap: string,
  tooltip: React.Node,
  label: React.Node,
  input: React.Node,
};

type Props = OptionalProps;

const defaultProps = {
  vertical: false,
  verticalGap: '5px',
};

const FieldItem = ({ vertical, verticalGap, tooltip, label, input }: Props) => (
  <div className={FieldItemWrapperStyle(vertical, verticalGap)}>
    {tooltip && <div className={TooltipAbsoluteWrapperStyle}>{tooltip}</div>}
    {label}
    {input}
  </div>
);

FieldItem.defaultProps = defaultProps;

export default FieldItem;
