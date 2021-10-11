// @flow
import * as React from 'react';
import {
  FieldItemWrapperStyle,
  LabelTooltipWrapperStyle,
  TooltipAbsoluteWrapperStyle,
  SubLabelStyle,
} from './style';

type OptionalProps = {
  vertical: boolean,
  verticalGap: string,
  tooltip: React.Node,
  label: React.Node,
  subLabel?: React.Portal,
  tooltipTop: boolean,
  input: React.Node,
};

type Props = OptionalProps;

const defaultProps = {
  vertical: false,
  verticalGap: '5px',
};

const FieldItem = ({
  vertical,
  verticalGap,
  tooltip,
  label,
  subLabel,
  tooltipTop,
  input,
}: Props) => (
  <div className={FieldItemWrapperStyle(vertical, verticalGap)}>
    {tooltip && label ? (
      <div className={LabelTooltipWrapperStyle}>
        <div className={TooltipAbsoluteWrapperStyle(tooltipTop)}>{tooltip}</div>
        {label}
        {subLabel && <span className={SubLabelStyle}>{subLabel}</span>}
      </div>
    ) : (
      <>
        {tooltip && <div className={TooltipAbsoluteWrapperStyle}>{tooltip}</div>}
        {label}
      </>
    )}
    {input}
  </div>
);

FieldItem.defaultProps = defaultProps;

export default FieldItem;
