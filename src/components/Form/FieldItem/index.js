// @flow
import * as React from 'react';
import {
  FieldItemWrapperStyle,
  LabelTooltipWrapperStyle,
  TooltipAbsoluteWrapperStyle,
} from './style';

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
  <div
    className={FieldItemWrapperStyle(vertical, verticalGap)}
    role="presentation"
    onClick={event => {
      event.stopPropagation();
    }}
  >
    {tooltip && label ? (
      <div className={LabelTooltipWrapperStyle}>
        <div className={TooltipAbsoluteWrapperStyle}>{tooltip}</div>
        {label}
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
