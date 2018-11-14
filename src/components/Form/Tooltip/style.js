// @flow
import { css } from 'react-emotion';

export const TooltipRelativeWrapperStyle: string = css`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BubbleWrapperStyle = (isShown: boolean): string => css`
  display: ${!isShown && 'none'};
  &:hover {
    display: block;
  }
`;
