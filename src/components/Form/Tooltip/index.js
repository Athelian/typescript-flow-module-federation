// @flow
import React from 'react';
import TooltipBubble from './TooltipBubble';
import TooltipIcon from './TooltipIcon';
import type { TooltipBubbleProps } from './TooltipBubble/type.js.flow';
import type { TooltipIconProps } from './TooltipIcon/type.js.flow';
import { TooltipWrapperStyle } from './style';

const getTooltipType = ({ infoMessage, errorMessage, warningMessage }: TooltipBubbleProps) => {
  if (errorMessage) return 'error';
  if (warningMessage) return 'warning';
  if (infoMessage) return 'info';
  return 'changed';
};

type Props = TooltipBubbleProps & TooltipIconProps;

const Tooltip = ({ infoMessage, ...rest }: Props) => {
  const { errorMessage, warningMessage } = rest;
  const tooltipMessage = { infoMessage, errorMessage, warningMessage };
  const type = getTooltipType(tooltipMessage);

  return (
    <div className={TooltipWrapperStyle}>
      <TooltipBubble infoMessage={infoMessage} {...rest} />
      <TooltipIcon type={type} hasInfo={!!infoMessage} />
    </div>
  );
};

export default Tooltip;
