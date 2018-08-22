// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import Divider from './components/Divider';
import {
  TooltipBubbleWrapperStyle,
  UpperMessageStyle,
  OldValueStyle,
  NewValueStyle,
  ArrowDownStyle,
  InfoMessageStyle,
} from './style';
import { type TooltipBubbleProps as Props, defaultTooltipBubbleProps } from './type';

const TooltipBubble = ({
  errorMessage,
  warningMessage,
  infoMessage,
  changedValues,
  position,
}: Props) => (
  <div className={TooltipBubbleWrapperStyle(position)}>
    {(errorMessage || warningMessage) && (
      <React.Fragment>
        <div className={UpperMessageStyle}>{errorMessage || warningMessage}</div>
        {(changedValues || infoMessage) && <Divider />}
      </React.Fragment>
    )}
    {changedValues && (
      <React.Fragment>
        <div className={OldValueStyle}>{changedValues.oldValue}</div>
        <div className={ArrowDownStyle}>
          <Icon icon="ARROW_DOWN" />
        </div>
        <div className={NewValueStyle}>{changedValues.newValue}</div>
        {infoMessage && <Divider />}
      </React.Fragment>
    )}
    {infoMessage && <div className={InfoMessageStyle}>{infoMessage}</div>}
  </div>
);

TooltipBubble.defaultProps = defaultTooltipBubbleProps;
export default TooltipBubble;
