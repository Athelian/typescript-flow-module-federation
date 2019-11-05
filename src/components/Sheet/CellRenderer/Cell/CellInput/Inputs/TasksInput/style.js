// @flow
import { css } from 'react-emotion';
import { fontSizes, layout, colors, borderRadiuses, presets, scrollbars } from 'styles/common';

export const TasksInputWrapperStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
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
  ${layout.VERTICAL};
  flex: 1;
  padding: 0 5px 0 0;
  overflow: hidden;
`;

export const NumCompletedStyle: string = css`
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  color: ${colors.BLACK};
  height: 20px;
  line-height: 20px;
  font-weight: bold;
  text-align: left;
`;

export const TasksBarWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  height: 5px;
  background-color: rgba(0, 0, 0, 0.1);
`;

export const TasksBarStyle = (completedOrSkippedPercentage: number): string => css`
  ${borderRadiuses.BUTTON};
  background-color: ${colors.TEAL};
  height: 100%;
  width: ${completedOrSkippedPercentage > 1 ? 100 : completedOrSkippedPercentage * 100}%;
  min-width: ${completedOrSkippedPercentage > 0 ? '5px' : '0px'};
`;

export const TasksSectionWrapperStyle: string = css`
  ${presets.BOX};
  position: relative;
  width: 880px;
  height: min-content;
`;

export const TasksSectionStyle: string = css`
  ${borderRadiuses.MAIN};
  ${scrollbars.SMALL};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  overflow-x: hidden;
  overflow-y: overlay;
  display: flex;
  flex-wrap: wrap;
  padding: 15px 0 15px 10px;
  position: relative;
  max-height: 70vh;
  min-height: 523px;
`;

export const TemplateItemStyle: string = css`
  ${layout.VERTICAL};
  ${layout.JUSTIFIED_CENTER};
  ${borderRadiuses.MAIN};
  background: ${colors.GRAY_VERY_LIGHT};
  margin: 5px 0;
  padding: 0 7.5px;
  height: 260px;
`;
