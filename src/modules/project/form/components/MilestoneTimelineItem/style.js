// @flow
import { css } from 'react-emotion';

import { colors, borderRadiuses, presets, fontSizes } from 'styles/common';

export const TimelineItemStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const MilestoneNameStyle: string = css`
  width: 115px;
  height: 20px;
  ${presets.ELLIPSIS};
  ${borderRadiuses.BUTTON};
  text-align: center;
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const ProgressBarStyle: string = css`
  display: flex;
  position: relative;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: 100%;
  ${borderRadiuses.BUTTON};
  margin: 15px 0;
`;

export const BarStyle = (percent: number): string => css`
  background-color: ${percent ? colors.TEAL : colors.GRAY_SUPER_LIGHT};
  height: 10px;
  min-width: 10px;
  width: ${percent}%;
  ${borderRadiuses.BUTTON};
`;

export const MilestoneTickStyle = (isCompleted: boolean): string => css`
  position: absolute;
  right: -15px;
  top: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  z-index: 1;
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  ${isCompleted
    ? `
    color: ${colors.WHITE};
    background-color: ${colors.TEAL};
  `
    : `
    color: ${colors.GRAY_DARK};
    background-color: ${colors.GRAY_SUPER_LIGHT};
  `};
`;

export const TasksWrapperStyle: string = css`
  display: flex;
  align-items: center;
  line-height: 20px;
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  height: 20px;
  max-width: 115px;
  ${fontSizes.SMALL};
  padding: 0 0 0 5px;
`;

export const CompletedTasksStyle = (count: number): string => css`
  color: ${count > 0 ? colors.TEAL : colors.GRAY_DARK};
  font-weight: bold;
`;

export const TotalTasksStyle: string = css`
  color: ${colors.GRAY_DARK};
`;

export const TaskIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.TASK};
  width: 20px;
  height: 20px;
`;
