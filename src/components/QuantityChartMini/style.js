// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, layout } from 'styles/common';

export const QuantityChartWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_VERTICAL};
`;

export const BarWrapperStyle: string = css`
  position: relative;
  height: 15px;
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 100%;
`;

export const ProgressBarStyle = (color: string, percent: number): string => css`
  background-color: ${colors[color]};
  ${borderRadiuses.BUTTON};
  height: inherit;
  width: ${percent > 1 ? 100 : percent * 100}%;
  min-width: ${percent > 0 ? '15px' : '0px'};
  opacity: 0.5;
`;

export const IconStyle: string = css`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 9px;
  height: 15px;
  width: 15px;
  ${borderRadiuses.CIRCLE};
  background-color: rgba(0, 0, 0, 0.2);
  color: ${colors.WHITE};
`;

export const BadgeStyle = (positioning: 'top' | 'bottom'): string => css`
  position: absolute;
  ${positioning}: 0;
  left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 9px;
  height: 10px;
  min-width: 10px;
  line-height: 10px;
  font-weight: bold;
  ${borderRadiuses.BUTTON};
  background-color: ${positioning === 'bottom' ? colors.SHIPMENT : colors.BATCH};
  color: ${colors.WHITE};
  padding: 0 3px;
`;

export const FloatingQuantityWrapperStyle: string = css`
  position: absolute;
  top: 7.5px;
  height: 15px;
  background-color: ${colors.WHITE};
  ${borderRadiuses.BUTTON};
  width: min-content;
  max-width: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
`;
