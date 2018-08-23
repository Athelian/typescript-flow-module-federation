// @flow
import { css } from 'react-emotion';
import { shadows, fontSizesWithHeights, borderRadiuses } from 'styles/common';
import type { BubblePositionType } from './type';

const bubbleWidth = 150;
const arrowSize = 8;
const iconHeight = 15.5;
const bubbleBackgroundColor = 'rgba(0, 0, 0, 0.4)';

const arrowForTop = css`
  &:after {
    border-right: ${arrowSize}px solid transparent;
    border-left: ${arrowSize}px solid transparent;
    border-top: ${arrowSize}px solid ${bubbleBackgroundColor};
    bottom: -${arrowSize}px;
  }
`;

// @FIXME: need this somehow, otherwise get wrong position.
const tweakForTopArrow = 3;
const onTopStyle = css`
  left: 0;
  bottom: ${iconHeight + arrowSize + tweakForTopArrow}px;
  margin-left: -${bubbleWidth / 2}px;
  ${arrowForTop};
`;

const arrowForBottom = css`
  &:after {
    border-right: ${arrowSize}px solid transparent;
    border-left: ${arrowSize}px solid transparent;
    border-bottom: ${arrowSize}px solid ${bubbleBackgroundColor};
    top: -${arrowSize}px;
  }
`;

const onBottomStyle = css`
  left: 0;
  top: ${iconHeight + arrowSize}px;
  margin-left: -${bubbleWidth / 2}px;
  ${arrowForBottom};
`;

export const TooltipBubbleWrapperStyle = (position: ?BubblePositionType) => css`
  position: absolute;
  ${shadows.TOOLTIP};
  ${fontSizesWithHeights.MEDIUM};
  background: ${bubbleBackgroundColor};
  width: ${bubbleWidth}px;
  padding: 10px;
  color: #fff;
  ${borderRadiuses.MAIN};
  display: flex;
  flex-flow: column wrap;
  align-items: center;

  ${position === 'top' && onTopStyle};
  ${position === 'bottom' && onBottomStyle};

  &:after {
    content: '';
    display: block;
    position: absolute;
  }
`;

const MessageStyle = css`
  display: flex;
  flex-wrap: wrap;
  white-space: nowrap;
  max-width: 300px;
`;

export const UpperMessageStyle = css`
  ${MessageStyle};
  padding-bottom: 5px;
`;

export const OldValueStyle = css`
  padding: 5px;
`;

export const ArrowDownStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
`;

export const NewValueStyle = css`
  padding: 5px;
`;

export const InfoMessageStyle = css`
  ${MessageStyle};
  padding-top: 5px;
`;
