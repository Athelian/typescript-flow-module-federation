// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, presets, borderRadiuses } from 'styles/common';

export const TaskRingTooltipWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
`;

export const TaskRingTooltipHeaderStyle: string = css`
  border-bottom: 1px solid ${colors.WHITE};
  ${fontSizes.SMALL};
  padding: 0 0 5px 0;
  letter-spacing: 2px;
`;

export const TaskRingTooltipInfoStyle: string = css`
  display: flex;
  align-items: center;
`;

export const TaskRingTooltipIconStyle: string = css`
  display: flex;
  align-items: center;
  ${fontSizes.SMALL};
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

export const TaskRingTooltipLabelStyle: string = css`
  ${fontSizes.SMALL};
  flex: 1;
  text-align: left;
  letter-spacing: 2px;
  padding: 0 5px 0 0;
`;

export const TaskRingTooltipCountStyle = (color: string, backgroundColor: string): string => css`
  background-color: ${colors[backgroundColor]};
  color: ${colors[color]};
  ${fontSizes.MAIN};
  font-weight: bold;
  width: 40px;
  ${presets.ELLIPSIS};
  text-align: center;
  ${borderRadiuses.BUTTON};
  padding: 0 5px;
`;
