// @flow
import { css } from 'react-emotion';
import { transitions } from 'styles/common';

export const TooltipWrapperStyle = css`
  position: relative;
  width: min-content;
  height: min-content;
`;

export const BubbleWrapperStyle = (isShown: boolean) => css`
  opacity: ${isShown ? '1' : '0'};
  ${transitions.MAIN};
`;
