// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, fontSizes, layout } from 'styles/common';

export const TaskStatusChartStyle: string = css`
  width: 100%;
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
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
  border: 1px solid ${color === 'WHITE' ? colors.TEAL : colors[color]};
  height: inherit;
  width: ${percent > 1 ? 100 : percent * 100}%;
  min-width: ${percent > 0 ? '20px' : '0px'};
`;

export const PropsStyle: string = css`
  height: 20px;
  width: 100%;
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
  justify-content: space-between;
`;

export const NumberStyle = (color: string): string => css`
  height: 20px;
  width: 40px;
  ${presets.ELLIPSIS};
  text-overflow: clip;
  ${borderRadiuses.BUTTON};
  background-color: ${colors[color]};
  border: 1px solid ${color === 'WHITE' ? colors.TEAL : colors[color]};
  color: ${color === 'WHITE' ? colors.TEAL : colors.WHITE};
  text-align: center;
  ${fontSizes.SMALL};
  line-height: 18px;
  padding: 0 2px;
  & > svg {
    margin: 0 2px 0 0;
  }
`;
