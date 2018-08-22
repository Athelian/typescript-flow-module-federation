// @flow
import * as React from 'react';
import { TooltipBubbleWrapperStyle, ArrowDownStyle } from './style';
import Divider from './components/Divider';
import { type TooltipBubbleProps as Props, defaultTooltipBubbleProps } from './type.js.flow';

const TooltipBubble = ({
  errorMessage,
  warningMessage,
  infoMessage,
  changedValues,
  position,
}: Props) => (
  <div className={TooltipBubbleWrapperStyle(position)}>
    {errorMessage ||
      (warningMessage && (
        <div>
          <div>{errorMessage || warningMessage}</div>
          <Divider />
        </div>
      ))}
    {changedValues && (
      <div>
        <div>{changedValues.oldValue}</div>
        <div className={ArrowDownStyle} />
        <div>{changedValues.newValue}</div>
      </div>
    )}
    {infoMessage && (
      <div>
        <Divider />
        <div>{infoMessage}</div>
      </div>
    )}
  </div>
);

TooltipBubble.defaultProps = defaultTooltipBubbleProps;
export default TooltipBubble;
