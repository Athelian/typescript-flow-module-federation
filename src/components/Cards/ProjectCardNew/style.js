// @flow
import { css } from 'react-emotion';

import {
  colors,
  borderRadiuses,
  presets,
  fontSizes,
  scrollbars,
  fontSizesWithHeights,
  layout,
} from 'styles/common';

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
  justify-content: space-between;
  padding: 0 20px 0 0;
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
  grid-gap: 5px;
`;

export const MilestoneNameStyle = (completed: boolean): string => css`
  height: 20px;
  width: auto;
  max-width: calc(100% - 10px);
  line-height: 20px;
  ${presets.ELLIPSIS};
  ${borderRadiuses.BUTTON};
  background-color: ${completed ? colors.TEAL : colors.GRAY_SUPER_LIGHT};
  color: ${completed ? colors.WHITE : colors.GRAY_DARK};
  font-weight: bold;
  ${fontSizes.MEDIUM};
  padding: 0 10px;
  margin: 0 0 0 10px;
  & > svg {
    margin: 0 2px 0 0;
  }
`;

export const ProgressBarStyle: string = css`
  position: relative;
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_LIGHT};
  width: 100%;
`;

export const BarStyle = (percent: number): string => css`
  background-color: ${percent ? colors.TEAL : colors.GRAY_LIGHT};
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
  right: -7px;
  top: -2px;
  background-color: ${completed ? colors.TEAL : colors.GRAY_LIGHT};
  height: 14px;
  width: 14px;
  ${borderRadiuses.CIRCLE};
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  z-index: 1;
  color: ${completed ? colors.WHITE : colors.GRAY_DARK};
  font-size: 10px;
`;

export const TasksWrapperStyle = (completed: boolean): string => css`
  display: flex;
  ${presets.ELLIPSIS};
  ${borderRadiuses.BUTTON};
  background-color: ${completed ? colors.TEAL : colors.GRAY_SUPER_LIGHT};
  padding: 5px;
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

export const ProjectNameStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  ${presets.ELLIPSIS};
`;

export const ProjectDueDateStyle: string = css`
  display: grid;
  width: 160px;
  grid-template-columns: 40px 60px 40px 20px;
  ${fontSizes.SMALL};
`;

export const DateStyle: string = css`
  display: grid;
  width: 140px;
  grid-template-columns: 36px 60px;
  ${fontSizes.SMALL};
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: end;
  grid-gap: 5px;
  overflow: hidden;
  height: 18px;
  width: 300px;
`;
