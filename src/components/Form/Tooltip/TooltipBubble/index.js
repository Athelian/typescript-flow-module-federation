// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import {
  TooltipBubbleWrapperStyle,
  UpperMessageStyle,
  OldValueStyle,
  NewValueStyle,
  ArrowDownStyle,
  InfoMessageStyle,
  DividerStyle,
} from './style';
import { type TooltipBubbleProps, defaultTooltipBubbleProps } from './type';

type Props = TooltipBubbleProps & {
  showChanged: boolean,
};

const TooltipBubble = ({
  showChanged,
  errorMessage,
  warningMessage,
  infoMessage,
  changedValues,
  position,
}: Props) => (
  <div className={TooltipBubbleWrapperStyle(position)}>
    {errorMessage && (
      <React.Fragment>
        <div className={UpperMessageStyle}>{errorMessage}</div>
        {(warningMessage || changedValues.oldValue || infoMessage) && (
          <div className={DividerStyle} />
        )}
      </React.Fragment>
    )}

    {warningMessage && (
      <React.Fragment>
        <div className={UpperMessageStyle}>{warningMessage}</div>
        {(changedValues.oldValue || infoMessage) && <div className={DividerStyle} />}
      </React.Fragment>
    )}

    {showChanged && (
      <React.Fragment>
        <div className={OldValueStyle}>{changedValues.oldValue}</div>
        <div className={ArrowDownStyle}>
          <Icon icon="ARROW_DOWN" />
        </div>
        <div className={NewValueStyle}>{changedValues.newValue}</div>
        {infoMessage && <div className={DividerStyle} />}
      </React.Fragment>
    )}

    {infoMessage && <div className={InfoMessageStyle}>{infoMessage}</div>}
  </div>
);

TooltipBubble.defaultProps = defaultTooltipBubbleProps;

export default TooltipBubble;
