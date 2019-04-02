// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, fontSizes } from 'styles/common';

export const TaskRingStyle = (size: number): string => css`
  position: relative;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  width: ${size}px;
  height: ${size}px;
  flex-shrink: 0;
  border: 2px solid ${colors.GRAY_LIGHT};
`;

export const NumberStyle = (size: number): string => css`
  color: ${colors.BLACK};
  ${fontSizes.SMALL};
  font-weight: bold;
  width: ${size}px;
  height: ${size}px;
  line-height: ${size}px;
  text-align: center;
`;

export const TooltipStyle: string = css`
  background-color: ${colors.BLACK};
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
`;
