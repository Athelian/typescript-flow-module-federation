// @flow
import { type TooltipBubbleProps, defaultTooltipBubbleProps } from './TooltipBubble/type';

type OptionalProps = {
  preShow: boolean,
  showDuration: number,
  isNew: boolean,
  tooltipBubbleOptions: TooltipBubbleProps,
};

export type TooltipProps = OptionalProps & {};

export const defaultTooltipProps = {
  preShow: false,
  showDuration: 1500,
  isNew: false,
  tooltipBubbleOptions: defaultTooltipBubbleProps,
};

export default defaultTooltipProps;
