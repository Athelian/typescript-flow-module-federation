// @flow
import { css } from 'react-emotion';

export const TooltipRelativeWrapperStyle = css`
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BubbleWrapperStyle = (isShown: boolean) => css`
  display: ${!isShown && 'none'};
  &:hover {
    display: block;
  }
`;
