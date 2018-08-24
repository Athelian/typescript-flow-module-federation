// @flow
import * as React from 'react';
import { type LabelProps, defaultLabelProps } from 'components/Form/Label/type';
import { type TooltipProps, defaultTooltipProps } from 'components/Form/Tooltip/type';
import Label from 'components/Form/Label';
import Tooltip from 'components/Form/Tooltip';
import { FieldItemWrapperStyle } from './style';

type OptionalProps = {
  vertical: boolean,
  labelOptions: LabelProps,
  tooltipOptions: TooltipProps,
};

type Props = OptionalProps & {
  label: React.Node,
  input: (hasError: boolean) => React.Node,
};

const defaultProps = {
  vertical: false,
  labelOptions: defaultLabelProps,
  tooltipOptions: defaultTooltipProps,
};

const FieldItem = ({ vertical, label, input, labelOptions, tooltipOptions }: Props) => {
  const mergedLabelOptions = { ...defaultLabelProps, ...labelOptions };
  const mergedTooltipOptions = { ...defaultTooltipProps, ...tooltipOptions };
  return (
    <div className={FieldItemWrapperStyle(vertical)}>
      <Tooltip {...mergedTooltipOptions} />
      <Label {...mergedLabelOptions}>{label}</Label>
      {input(!!tooltipOptions.tooltipBubbleOptions.errorMessage)}
    </div>
  );
};

FieldItem.defaultProps = defaultProps;

export default FieldItem;
