// @flow
import { css } from 'react-emotion';

import { borderRadiuses, fontSizes } from 'styles/common';

export const iconStyle = () => css`
  ${fontSizes.SMALL};
  height: 20px;
  width: 20px;
  ${borderRadiuses.CIRCLE};
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  display: inline-block;
  line-height: 20px;
  text-align: center;
`;

export const barStyle = () => css`
  height: 20px;
  ${borderRadiuses.BUTTON};
  background-color: rgba(0, 0, 0, 0.2);
`;

export const progressBarStyle = (color: string, percent: number) => {
  if (percent === 1) {
    return css`
      background-color: ${color}b3;
      ${borderRadiuses.BUTTON};
      height: inherit;
      width: ${percent * 100}%;
    `;
  }
  return css`
    background-color: ${color};
    border-top-left-radius: 999px;
    border-bottom-left-radius: 999px;
    height: inherit;
    width: ${percent * 100}%;
  `;
};

export const numberLineStyle = () => css`
  text-align: center;
`;

export const numberStyle = (color: string) => css`
  ${fontSizes.SMALL};
  height: 16px;
  color: ${color};
  margin-left: 6px;
  margin-right: 6px;
`;

export const centerTopNumberStyle = () => css`
  background-color: white;
  position: relative;
  top: 10px;
  ${borderRadiuses.BUTTON};
`;

export const centerBottomNumberStyle = () => css`
  background-color: white;
  position: relative;
  top: -10px;
  ${borderRadiuses.BUTTON};
`;

export const badgeStyle = (color: string) => css`
  ${fontSizes.SMALL};
  height: 12px;
  width: 12px;
  ${borderRadiuses.CIRCLE};
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  background-color: ${color};
  color: white;
  display: inline-block;
  text-align: center;
`;

export const batchedBadgeStyle = () => css`
  display: inline-block;
  position: relative;
  top: 3px;
  left: -6px;
`;

export const shippedBadgeStyle = () => css`
  display: inline-block;
  position: relative;
  top: -3px;
  left: -6px;
`;
