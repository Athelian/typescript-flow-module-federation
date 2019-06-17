// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets } from 'styles/common';

export const TaskStatusChartStyle: string = css`
  width: min-content;
  max-width: 100%;
`;

export const ChartStyle: string = css`
  height: 20px;
  width: 100%;
  display: inline-flex;
  & > :first-child {
    border-top-left-radius: 999px;
    border-bottom-left-radius: 999px;
  }
  & > :last-child {
    border-top-right-radius: 999px;
    border-bottom-right-radius: 999px;
  }
`;

export const BarStyle = (color: string, percent: number): string => css`
  background-color: ${colors[color]};
  ${color === 'WHITE' && `border: 1px solid ${colors.TEAL}`};
  height: inherit;
  width: ${percent > 1 ? 100 : percent * 100}%;
  min-width: ${percent > 0 ? '20px' : '0px'};
`;

export const PropsStyle: string = css`
  height: 20px;
  width: 100%;
  display: grid;
  grid-template-columns: auto auto auto auto;
  justify-content: space-between;
`;

export const NumberStyle = (color: string): string => css`
  height: 50px;
  ${presets.ELLIPSIS};
  max-width: 50px;
  min-width: 30px;
  ${borderRadiuses.BUTTON};
  background-color: ${colors[color]};
  border: 1px solid ${color === 'WHITE' ? colors.TEAL : colors.WHITE};
  color: ${color === 'WHITE' ? colors.TEAL : colors.WHITE};
  height: inherit;
  text-align: center;
`;
