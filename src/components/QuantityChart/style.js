// @flow
import { css } from 'react-emotion';

import { borderRadiuses, fontSizes, colors } from 'styles/common';

export const IconStyle = (color: string) => css`
  ${fontSizes.SMALL};
  height: 20px;
  width: 20px;
  ${borderRadiuses.CIRCLE};
  background-color: ${colors[color]};
  color: white;
  display: inline-block;
  line-height: 20px;
  text-align: center;
`;

export const BarStyle = css`
  height: 20px;
  ${borderRadiuses.BUTTON};
  background-color: rgba(0, 0, 0, 0.2);
`;

export const ProgressBarStyle = (color: string, percent: number) => {
  // I want to color with alpha=0.5 ,so #000000 will be #00000080.
  const backgroundColor = `${colors[color]}80`;
  if (percent === 1) {
    return css`
      background-color: ${backgroundColor};
      ${borderRadiuses.BUTTON};
      height: inherit;
      width: ${percent * 100}%;
    `;
  }
  return css`
    background-color: ${backgroundColor};
    border-top-left-radius: 999px;
    border-bottom-left-radius: 999px;
    height: inherit;
    width: ${percent * 100}%;
  `;
};

export const NumberLineStyle = css`
  text-align: center;
`;

export const NumberStyle = (color: string) => css`
  ${fontSizes.SMALL};
  height: 16px;
  color: ${colors[color]};
  margin-left: 6px;
  margin-right: 6px;
`;

export const CenterTopNumberStyle = css`
  background-color: white;
  position: relative;
  top: 10px;
  ${borderRadiuses.BUTTON};
`;

export const CenterBottomNumberStyle = css`
  background-color: white;
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
  color: white;
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
