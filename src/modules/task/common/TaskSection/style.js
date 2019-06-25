// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, scrollbars } from 'styles/common';

export const TasksSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const TasksSectionBodyStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 672px;
  min-height: 219px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
  display: flex;
  flex-wrap: wrap;
  padding: 15px 0 15px 10px;
`;

export const TemplateItemStyle: string = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 5px 0;
  background: ${colors.GRAY_VERY_LIGHT};
  ${borderRadiuses.MAIN};
  padding: 5px 10px 10px 10px;
  height: 260px;
`;
