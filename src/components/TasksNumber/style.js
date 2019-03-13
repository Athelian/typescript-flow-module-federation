// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, fontSizes } from 'styles/common';

export const TasksNumberStyle: string = css`
  position: relative;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: 2px solid ${colors.GRAY_LIGHT};
`;

export const NumberStyle: string = css`
  color: ${colors.BLACK};
  ${fontSizes.SMALL};
  font-weight: bold;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
`;

export const TaskInfoStyle: string = css`
  display: grid;
  grid-template-columns: 20px 80px 20px;
  align-items: left;
`;

export const TooltipStyle: string = css`
  background-color: ${colors.BLACK};
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
`;
