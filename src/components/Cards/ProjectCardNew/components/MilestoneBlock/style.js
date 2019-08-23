// @flow
import { css } from 'react-emotion';

import { colors, borderRadiuses, presets, fontSizes } from 'styles/common';

export const TimelineStyle: string = css`
  justify-items: right;
  display: grid;
  grid-gap: 12px;
`;

export const MilestoneNameStyle = (completed: boolean): string => css`
  line-height: 20px;
  height: 20px;
  width: 115px;
  text-align: center;
  ${presets.ELLIPSIS};
  ${borderRadiuses.BUTTON};
  background-color: ${completed ? colors.TEAL : colors.GRAY_SUPER_LIGHT};
  color: ${completed ? colors.WHITE : colors.BLACK};
  padding: 0 10px;
  margin: 0 0 0 10px;
  & > svg {
    margin: 0 2px 0 0;
  }
`;

export const ProgressBarStyle: string = css`
  position: relative;
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: 100%;
`;

export const BarStyle = (percent: number): string => css`
  background-color: ${percent ? colors.TEAL : colors.GRAY_SUPER_LIGHT};
  height: 10px;
  min-width: 10px;
  width: ${percent}%;
  ${borderRadiuses.BUTTON};
`;

export const MilestoneTickStyle = (completed: boolean): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -15px;
  top: -10px;
  background-color: ${completed ? colors.TEAL : colors.GRAY_SUPER_LIGHT};
  color: ${completed ? colors.WHITE : colors.GRAY_DARK};
  height: 30px;
  width: 30px;
  ${borderRadiuses.CIRCLE};
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  z-index: 1;
  ${fontSizes.SMALL};
`;

export const TasksWrapperStyle = (completed: boolean): string => css`
  display: flex;
  ${presets.ELLIPSIS};
  ${borderRadiuses.BUTTON};
  background-color: ${completed ? colors.TEAL : colors.GRAY_SUPER_LIGHT};
  padding: 5px;
  max-width: 115px;
`;

export const CompletedTasksStyle = (completed: boolean, count: number): string => {
  let color = colors.GRAY_DARK;
  if (completed) {
    color = colors.WHITE;
  } else if (count > 0) {
    color = colors.TEAL;
  }
  return css`
    color: ${color};
  `;
};

export const TotalTasksStyle = (completed: boolean): string => css`
  ${fontSizes.SMALL};
  color: ${completed ? colors.WHITE : colors.GRAY_DARK};
  margin: 0 0 0 3px;
`;

export const TaskIconStyle = (completed: boolean): string => css`
  color: ${completed ? colors.WHITE : colors.PURPLE};
`;

export const MilestoneDateStyle: string = css`
  position: relative;
  display: grid;
  width: 140px;
  grid-template-columns: 55px 65px;
  ${fontSizes.SMALL};
`;

export const MilestoneDiffDateStyle = (color: string): string => css`
  position: absolute;
  right: 5px;
  color: ${color};
`;
