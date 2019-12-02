// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, fontSizes, presets, transitions, shadows } from 'styles/common';

const getBackgroundColor = (canDrop: boolean, isOver: boolean): string => {
  if (canDrop) {
    if (isOver) {
      return 'rgba(17, 209, 166, 0.5)';
    }
    return 'rgba(17, 209, 166, 0.1)';
  }
  return 'rgba(239, 72, 72, 0.1)';
};

export const DroppableOverlayStyle = (canDrop: boolean, isOver: boolean): string => css`
  background-color: ${getBackgroundColor(canDrop, isOver)};
  width: 100%;
  height: 55px;
  ${borderRadiuses.MAIN};
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  ${transitions.MAIN};
`;

export const MessageStyle = (canDrop: boolean): string => css`
  background-color: ${canDrop ? 'rgba(17, 209, 166, 0.7)' : 'rgba(239, 72, 72, 0.7)'};
  padding: 5px 3px 5px 5px;
  ${borderRadiuses.MAIN};
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  text-transform: uppercase;
  letter-spacing: 2px;
  ${presets.ELLIPSIS};
  ${shadows.INPUT};
  text-align: center;
`;
