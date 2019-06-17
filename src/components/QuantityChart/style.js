// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, layout } from 'styles/common';

export const QuantityChartWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_VERTICAL};
`;

export const FloatingQuantityWrapperStyle = (positioning: 'top' | 'bottom'): string => css`
  position: absolute;
  ${positioning}: -8px;
  height: 16px;
  background-color: ${colors.WHITE};
  ${borderRadiuses.BUTTON};
  width: min-content;
  max-width: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
`;

export const BarWrapperStyle: string = css`
  position: relative;
  height: 20px;
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 100%;
`;

export const ProgressBarStyle = (color: string, percent: number): string => css`
  background-color: ${colors[color]};
  ${borderRadiuses.BUTTON};
  height: inherit;
  width: ${percent > 1 ? 100 : percent * 100}%;
  min-width: ${percent > 0 ? '20px' : '0px'};
  opacity: 0.5;
`;

export const IconStyle: string = css`
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

export const BadgeStyle = (positioning: 'top' | 'bottom'): string => css`
  position: absolute;
  ${positioning}: 0;
  left: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  height: 12px;
  min-width: 12px;
  line-height: 12px;
  ${borderRadiuses.BUTTON};
  font-weight: bold;
  background-color: ${positioning === 'bottom' ? colors.BATCH : colors.SHIPMENT};
  color: ${colors.WHITE};
  padding: 0 3px;
`;
