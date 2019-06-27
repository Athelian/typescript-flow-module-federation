// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, presets, borderRadiuses } from 'styles/common';

export const TaskRingTooltipWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
`;

export const TaskRingTooltipHeaderStyle: string = css`
  ${fontSizes.SMALL};
  letter-spacing: 2px;
`;

export const TaskRingBodyStyle: string = css`
  background-color: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  padding: 5px;
  margin: 0 0 5px 0;
`;

export const TaskRingTooltipInfoStyle: string = css`
  display: flex;
  align-items: center;
`;

export const TaskRingTooltipIconStyle = (color: string): string => css`
  display: flex;
  align-items: center;
  ${fontSizes.SMALL};
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${colors[color]};
`;

export const TaskRingTooltipLabelStyle: string = css`
  ${fontSizes.SMALL};
  flex: 1;
  text-align: left;
  letter-spacing: 2px;
  padding: 0 5px;
  color: ${colors.GRAY_DARK};
`;

export const TaskRingTooltipCountStyle: string = css`
  color: ${colors.BLACK};
  ${fontSizes.MAIN};
  font-weight: bold;
  width: 40px;
  ${presets.ELLIPSIS};
  text-align: right;
`;
