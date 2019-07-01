// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, fontSizes, scrollbars } from 'styles/common';

export const TimelineWrapperStyle: string = css`
  display: grid;
  grid-auto-columns: minmax(100px, 1fr);
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

export const MilestoneNameStyle: string = css`
  height: 20px;
  width: auto;
  max-width: calc(100% - 10px);
  line-height: 20px;
  ${presets.ELLIPSIS};
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.BLACK};
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

export const TasksWrapperStyle: string = css`
  display: flex;
  ${presets.ELLIPSIS};
`;

export const CompletedTasksStyle: string = css`
  ${fontSizes.SMALL};
  color: ${colors.TEAL};
  font-weight: bold;
`;

export const TotalTasksStyle: string = css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  margin: 0 0 0 3px;
`;

export const DueDateStyle: string = css`
  ${fontSizes.SMALL};
  color: ${colors.BLACK};
  font-weight: bold;
`;
