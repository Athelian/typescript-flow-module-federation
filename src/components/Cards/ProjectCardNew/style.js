// @flow
import { css } from 'react-emotion';

import { colors, borderRadiuses, presets, fontSizes, scrollbars, layout } from 'styles/common';

export const InfoIconStyle: string = css`
  color: ${colors.GRAY_LIGHT};
`;

export const ProjectCardStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 645px;
  height: 181px;
`;

export const ProjectCardHeaderStyle: string = css`
  width: 100%;
  display: flex;
  padding: 5px 35px 5px 5px;
  ${fontSizes.MAIN};
`;

export const ProjectNameStyle: string = css`
  width: 200px;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
`;

export const ProjectDueDateStyle: string = css`
  display: grid;
  width: 170px;
  grid-template-columns: 30px 70px 20px 20px;
  grid-gap: 10px;
`;

export const ProjectCardBodyStyle: string = css`
  display: grid;
  grid-auto-columns: minmax(143.75px, 1fr);
  grid-auto-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: overlay;
  padding: 20px 27px 20px 20px;
  ${fontSizes.SMALL};
  ${scrollbars.SMALL};
`;

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

export const DiffDateStyle = (diff: number): string => css`
  color: ${diff > 0 ? colors.RED : colors.TEAL};
`;

export const DateStyle: string = css`
  position: relative;
  display: grid;
  width: 140px;
  grid-template-columns: 55px 65px;

  ${fontSizes.SMALL};
`;

export const MilestoneDiffDateStyle = (diff: number): string => css`
  position: absolute;
  right: 5px;
  color: ${diff > 0 ? colors.RED : colors.TEAL};
`;

export const MilestoneDateStyle: string = css`
  // position: relative;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: end;
  grid-gap: 5px;
  overflow: hidden;
  height: 18px;
  width: 300px;
`;
