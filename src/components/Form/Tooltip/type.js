// @flow
import { type TooltipBubbleProps, defaultTooltipBubbleProps } from './TooltipBubble/type';

export type TooltipProps = {
  preShow: boolean,
  showDuration: number,
  tooltipBubbleProps: TooltipBubbleProps,
};

export const defaultTooltipProps = {
  preShow: false,
  showDuration: 500,
  tooltipBubbleProps: defaultTooltipBubbleProps,
};

export default defaultTooltipProps;
