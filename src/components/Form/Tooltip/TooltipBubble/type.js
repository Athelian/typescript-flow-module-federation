// @flow
export type BubblePositionType = 'top' | 'bottom';

export type TooltipBubbleProps = {
  errorMessage: React.Node,
  warningMessage: React.Node,
  infoMessage: React.Node,
  changedValues: {
    oldValue: React.Node,
    newValue: React.Node,
  },
  position: BubblePositionType,
};

export const defaultTooltipBubbleProps = {
  errorMessage: '',
  warningMessage: '',
  infoMessage: '',
  changedValues: {
    oldValue: '',
    newValue: '',
  },
  position: 'top',
};

export default defaultTooltipBubbleProps;
