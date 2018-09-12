// @flow
import { css } from 'react-emotion';
import {
  colors,
  shadows,
  fontSizesWithHeights,
  borderRadiuses,
  fontSizes,
  presets,
} from 'styles/common';
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
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  position: absolute;
  ${shadows.TOOLTIP};
  ${fontSizesWithHeights.MEDIUM};
  background: ${bubbleBackgroundColor};
  width: ${bubbleWidth}px;
  padding: 10px;
  color: #fff;
  ${borderRadiuses.MAIN};
  ${position === 'top' && onTopStyle};
  ${position === 'bottom' && onBottomStyle};
  &:after {
    content: '';
    display: block;
    position: absolute;
  }
`;

const MessageStyle = css`
  width: 100%;
`;

const ValueStyle = css`
  ${presets.ELLIPSIS};
  width: 100%;
  text-align: center;
`;

export const UpperMessageStyle = css`
  ${MessageStyle};
`;

export const OldValueStyle = css`
  ${ValueStyle};
`;

export const ArrowDownStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  ${fontSizes.SMALL};
`;

export const NewValueStyle = css`
  ${ValueStyle};
`;

export const InfoMessageStyle = css`
  ${MessageStyle};
`;

export const DividerStyle = css`
  height: 1px;
  width: 100%;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 5px 0;
`;
