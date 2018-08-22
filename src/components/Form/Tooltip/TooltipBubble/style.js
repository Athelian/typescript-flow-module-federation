// @flow
import { css } from 'react-emotion';
import { shadows, fontSizesWithHeights, borderRadiuses } from 'styles/common';
import type { BubblePositionType } from './type';

const widthSize = 150;
const paddingSize = 10;
const distanceSize = 8;
const bubbleBackgroundColor = 'rgba(0, 0, 0, 0.4)';

const arrowOnTop = css`
  &:after {
    border-right: ${distanceSize}px solid transparent;
    border-left: ${distanceSize}px solid transparent;
    border-top: ${distanceSize}px solid ${bubbleBackgroundColor};
    bottom: -${distanceSize}px;
  }
`;

const onTopStyle = css`
  top: -${distanceSize}px;
  transform: translateY(-100%);
  margin-left: -${widthSize / 2}px;
  ${arrowOnTop};
`;

const arrowOnLeft = css`
  &:after {
    border-bottom: ${distanceSize}px solid transparent;
    border-top: ${distanceSize}px solid transparent;
    border-left: ${distanceSize}px solid ${bubbleBackgroundColor};
    top: calc(50% - 8px);
    right: -${distanceSize}px;
  }
`;

const onLeftStyle = css`
  right: ${distanceSize * 3}px;
  transform: translateY(-43%);
  ${arrowOnLeft};
`;

const arrowOnRight = css`
  &:after {
    border-bottom: ${distanceSize}px solid transparent;
    border-top: ${distanceSize}px solid transparent;
    border-right: ${distanceSize}px solid ${bubbleBackgroundColor};
    top: calc(50% - 8px);
    left: -${distanceSize}px;
  }
`;

const onRightStyle = css`
  left: ${distanceSize * 3}px;
  transform: translateY(-43%);
  ${arrowOnRight};
`;

const arrowOnBottom = css`
  &:after {
    border-right: ${distanceSize}px solid transparent;
    border-left: ${distanceSize}px solid transparent;
    border-bottom: ${distanceSize}px solid ${bubbleBackgroundColor};
    top: -${distanceSize}px;
  }
`;

const onBottomStyle = css`
  bottom: -${distanceSize}px;
  margin-left: -${widthSize / 2}px;
  transform: translateY(100%);
  ${arrowOnBottom};
`;

export const TooltipBubbleWrapperStyle = (position: ?BubblePositionType) => css`
  position: absolute;
  ${shadows.TOOLTIP};
  ${fontSizesWithHeights.MEDIUM};
  background: ${bubbleBackgroundColor};
  width: ${widthSize}px;
  padding: ${paddingSize}px;
  color: #fff;
  ${borderRadiuses.MAIN};
  display: flex;
  flex-flow: column wrap;
  align-items: center;

  ${position === 'top' && onTopStyle};
  ${position === 'left' && onLeftStyle};
  ${position === 'right' && onRightStyle};
  ${position === 'bottom' && onBottomStyle};

  &:after {
    content: '';
    display: block;
    width: 0;
    height: 0;
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
