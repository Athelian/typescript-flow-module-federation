// @flow
import { type TooltipBubbleProps, defaultTooltipBubbleProps } from './TooltipBubble/type';

type OptionalProps = {
  preShow: boolean,
  showDuration: number,
  tooltipBubbleProps: TooltipBubbleProps,
};

export type TooltipProps = OptionalProps & {};

export const defaultTooltipProps = {
  preShow: false,
  showDuration: 500,
  tooltipBubbleProps: defaultTooltipBubbleProps,
};

export default defaultTooltipProps;
