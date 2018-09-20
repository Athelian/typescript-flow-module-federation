// @flow
import { css } from 'react-emotion';
import { borderRadiuses, fontSizes, colors, layout } from 'styles/common';

export const QuantityChartWrapperStyle = css`
  position: relative;
  ${layout.GRID_VERTICAL};
`;

export const FloatingQuantityWrapperStyle = (positioning: 'top' | 'bottom') => css`
  position: absolute;
  ${positioning}: -8px;
  height: 16px;
  background-color: ${colors.WHITE};
  ${borderRadiuses.BUTTON};
  width: min-content;
  padding: 0 5px;
  max-width: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

export const BarWrapperStyle = css`
  position: relative;
  height: 20px;
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 100%;
`;

export const ProgressBarStyle = (color: string, percent: number) => css`
  background-color: ${colors[color]};
  ${borderRadiuses.BUTTON};
  height: inherit;
  width: ${percent > 1 ? 100 : percent * 100}%;
  opacity: 0.5;
`;

export const IconStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  height: 20px;
  width: 20px;
  ${borderRadiuses.CIRCLE};
  background-color: rgba(0, 0, 0, 0.2);
  color: ${colors.WHITE};
`;

export const BadgeStyle = (positioning: 'top' | 'bottom') => css`
  position: absolute;
  ${positioning}: 0;
  left: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${fontSizes.SMALL};
  height: 12px;
  min-width: 12px;
  ${borderRadiuses.BUTTON};
  font-weight: bold;
  background-color: ${positioning === 'bottom' ? colors.BATCH : colors.SHIPMENT};
  color: ${colors.WHITE};
  padding: 0 3px;
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
