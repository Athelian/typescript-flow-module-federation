// @flow
import { css } from 'react-emotion';
import { borderRadiuses, transitions, shadows, colors } from 'styles/common';

export const WrapperStyle = css`
  position: relative;
`;

export const TooltipStyle = (style: ?Object, isShown: boolean) => css`
  position: absolute;
  color: #fff;
  background-color: ${colors.GRAY_DARK};
  font-size: 12px;
  right: 0;
  bottom: 10px;
  padding: 5px;
  opacity: ${isShown ? '1' : '0'};
  z-index: ${isShown ? '999' : '-999'};
  ${borderRadiuses.MAIN};
  ${transitions.MAIN};
  ${shadows.TOOLTIP};
  ${style};
`;

export const IconStyle = (style: ?Object) => css`
  font-size: 12px;
  color: ${colors.GRAY_DARK};
  height: 15px;
  width: 15px;
  ${style};
`;
