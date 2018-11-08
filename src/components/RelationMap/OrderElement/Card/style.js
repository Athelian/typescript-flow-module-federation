// @flow
import { css } from 'react-emotion';

import { borderRadiuses, fontSizes, fontSizesWithHeights, colors, presets } from 'styles/common';

export const ProgressBarStyle = (color: string, percent: number) => css`
  background-color: ${colors[color]};
  ${borderRadiuses.BUTTON};
  height: inherit;
  width: ${percent > 1 ? 100 : percent * 100}%;
`;

export const SerialWrapperStyle = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
`;

export const ProductNameWrapperStyle = css`
  align-self: center;
`;

export const ProgressIconStyle = css`
  ${fontSizes.TINY};
  height: 15px;
  width: 15px;
  ${borderRadiuses.CIRCLE};
  background-color: rgba(0, 0, 0, 0.4);
  color: ${colors.WHITE};
  display: inline-block;
  line-height: 15px;
  text-align: center;
  vertical-align: top;
  float: left;
`;

export const BarStyle = css`
  height: 15px;
  width: 100%;
  ${borderRadiuses.BUTTON};
  background-color: rgba(0, 0, 0, 0.2);
`;

export const NumberLineStyle = css`
  text-align: center;
  width: 100%;
  position: absolute;
  height: inherit;
`;

export const NumberStyle = (color: string) => css`
  ${fontSizes.SMALL};
  height: 16px;
  color: ${colors[color]};
  margin-left: 6px;
  margin-right: 6px;
`;

export const CenterTopNumberStyle = css`
  background-color: ${colors.WHITE};
  ${borderRadiuses.BUTTON};
  position: relative;
  top: 5px;
`;

export const CenterBottomNumberStyle = css`
  background-color: ${colors.WHITE};
  position: relative;
  top: -10px;
  ${borderRadiuses.BUTTON};
`;

export const BadgeStyle = (color: string) => css`
  ${fontSizes.SMALL};
  height: 12px;
  width: 12px;
  ${borderRadiuses.CIRCLE};
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  background-color: ${colors[color]};
  color: ${colors.WHITE};
  display: inline-block;
  text-align: center;
`;

export const BatchedBadgeStyle = css`
  display: inline-block;
  position: relative;
  top: 3px;
  left: -6px;
`;

export const ShippedBadgeStyle = css`
  display: inline-block;
  position: relative;
  top: -3px;
  left: -6px;
`;

export const BatchInfoStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 15px;
  line-height: 15px;

  > div:first-child {
    color: ${colors.GRAY_DARK};
    font-weight: 500;
  }
`;
