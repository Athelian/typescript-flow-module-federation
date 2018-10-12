// @flow
import * as React from 'react';

export type BubblePositionType = 'top' | 'bottom';

type OptionalProps = {
  errorMessage: React.Node,
  warningMessage: React.Node,
  infoMessage: React.Node,
  changedValues: {
    oldValue: React.Node,
    newValue: React.Node,
  },
  position: BubblePositionType,
};

export type TooltipBubbleProps = OptionalProps & {};

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
