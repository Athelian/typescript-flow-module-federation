// @flow
import { css } from 'react-emotion';
import { fontSizes, colors, borderRadiuses, presets, scrollbars } from 'styles/common';

export const TasksInputWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${fontSizes.MAIN};
  overflow: hidden;
  width: 100%;
  cursor: pointer;
`;

export const TasksCountWrapperStyle: string = css`
  width: 65px;
  flex-shrink: 0;
`;

export const TaskIconStyle: string = css`
  color: ${colors.TASK};
  width: 20px;
  text-align: center;
  flex-shrink: 0;
`;

export const TasksChartWrapperStyle: string = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 5px 0 0;
  overflow: hidden;
`;

export const NumCompletedStyle: string = css`
  ${fontSizes.SMALL};
  height: 20px;
  line-height: 20px;
  color: ${colors.BLACK};
  font-weight: bold;
  ${presets.ELLIPSIS};
  text-align: left;
`;

export const TasksBarWrapperStyle: string = css`
  height: 5px;
  ${borderRadiuses.MAIN};
  background-color: rgba(0, 0, 0, 0.1);
`;

export const TasksBarStyle = (completedOrSkippedPercentage: number): string => css`
  background-color: ${colors.TEAL};
  ${borderRadiuses.BUTTON};
  height: 100%;
  width: ${completedOrSkippedPercentage > 1 ? 100 : completedOrSkippedPercentage * 100}%;
  min-width: ${completedOrSkippedPercentage > 0 ? '5px' : '0px'};
`;

export const TasksSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const TasksSectionStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.SMALL};
  display: flex;
  flex-wrap: wrap;
  padding: 15px 0 15px 10px;
  position: relative;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 70vh;
  min-height: 523px;
`;

export const TemplateItemStyle: string = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 5px 0;
  background: ${colors.GRAY_VERY_LIGHT};
  ${borderRadiuses.MAIN};
  padding: 0 7.5px;
  height: 260px;
`;
