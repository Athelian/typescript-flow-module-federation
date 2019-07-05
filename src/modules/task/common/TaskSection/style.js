// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, scrollbars, shadows } from 'styles/common';

export const TasksSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const TasksSectionStyle: string = css`
  display: flex;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 70vh;
  min-height: 523px;
`;

export const TasksSectionProjectAreaStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  display: flex;
  width: 235px;
  padding: 15px 20px 20px 20px;
  ${shadows.HEADER_RIGHT};
  z-index: 2;
`;

export const TasksSectionTasksAreaStyle: string = css`
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
  width: 645px;
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
