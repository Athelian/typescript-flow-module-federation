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
  display: flex;
  flex-direction: column;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 672px;
  min-height: 219px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

export const ItemGridStyle: string = css`
  display: flex;
  flex-wrap: wrap;
  padding: 15px 0 15px 10px;
`;

export const TemplateItemStyle: string = css`
  display: flex;
  margin: 15px 10px;
  background: ${colors.GRAY};
  border-radius: 5px;
`;
