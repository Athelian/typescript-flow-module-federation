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
