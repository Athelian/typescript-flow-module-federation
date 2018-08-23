// @flow
import { css } from 'react-emotion';
import { colors, shadows, fontSizesWithHeights, borderRadiuses, fontSizes } from 'styles/common';
import type { BubblePositionType } from './type';

const bubbleWidth = 150;
const arrowSize = 8;
const iconHeight = 20;
const iconWidth = 20;
const bubbleBackgroundColor = colors.BLACK;

const arrowForTop = css`
  &:after {
    border-right: ${arrowSize}px solid transparent;
    border-left: ${arrowSize}px solid transparent;
    border-top: ${arrowSize}px solid ${bubbleBackgroundColor};
    bottom: -${arrowSize}px;
  }
`;

const onTopStyle = css`
  left: 0;
  bottom: ${iconHeight + arrowSize}px;
  margin-left: -${bubbleWidth / 2 - iconWidth / 2}px;
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
  margin-left: -${bubbleWidth / 2 - iconWidth / 2}px;
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
  justify-content: center;
  width: 100%;
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
  ${fontSizes.SMALL};
`;

export const NewValueStyle = css`
  padding: 5px;
`;

export const InfoMessageStyle = css`
  ${MessageStyle};
  padding-top: 5px;
`;
