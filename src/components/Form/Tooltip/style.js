// @flow
import { css } from 'react-emotion';
import { transitions } from 'styles/common';

export const TooltipAbsoluteWrapperStyle = css`
  position: absolute;
  left: -20px;
`;

export const TooltipRelativeWrapperStyle = css`
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BubbleWrapperStyle = (isShown: boolean) => css`
  opacity: ${isShown ? '1' : '0'};
  ${transitions.MAIN};
`;
