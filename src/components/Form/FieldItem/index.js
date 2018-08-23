// @flow
import * as React from 'react';
import { type LabelProps, defaultLabelProps } from 'components/Form/Label/type';
import { type TooltipProps, defaultTooltipProps } from 'components/Form/Tooltip/type';
import Label from 'components/Form/Label';
import Tooltip from 'components/Form/Tooltip';
import { FieldItemWrapperStyle } from './style';

type OptionalProps = {
  vertical: boolean,
  labelProps: LabelProps,
  tooltipProps: TooltipProps,
};

type Props = OptionalProps & {
  label: React.Node,
  input: (hasError: boolean) => React.Node,
};

const defaultProps = {
  vertical: false,
  labelProps: defaultLabelProps,
  tooltipProps: defaultTooltipProps,
};

const FieldItem = ({ vertical, label, input, labelProps, tooltipProps }: Props) => (
  <div className={FieldItemWrapperStyle(vertical)}>
    <Tooltip {...tooltipProps} />
    <Label {...labelProps}>{label}</Label>
    {input(!!tooltipProps.tooltipBubbleProps.errorMessage)}
  </div>
);

FieldItem.defaultProps = defaultProps;

export default FieldItem;
