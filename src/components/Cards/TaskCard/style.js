// @flow
import { css } from 'react-emotion';
import { layout, colors, presets, borderRadiuses, fontSizes } from 'styles/common';

export const TaskCardWrapperStyle = (hideParentInfo: boolean): string => css`
  ${layout.GRID_VERTICAL};
  grid-template-columns: 195px;
  grid-gap: 5px;
  width: 195px;
  height: ${hideParentInfo ? '159px' : '184px'};
  padding: 5px 0 10px 0;
`;

export const TaskParentWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 140px;
  padding: 0 10px;
  align-items: center;
`;

export const TaskParentIconStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 20px;
  height: 20px;
  background-color: ${colors.TEAL};
  color: ${colors.WHITE};
  font-size: 11px;
  &:hover,
  :focus {
    background-color: ${colors.TEAL_DARK};
  }
`;

export const TaskNameWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 160px;
  padding: 0 5px 0 10px;
`;

export const TaskPositionWrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  font-weight: bold;
`;

export const DragButtonWrapperStyle: string = css`
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  &:hover,
  :focus {
    color: ${colors.BLUE};
  }
`;

export const DateInputWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 65px 120px;
  width: 100%;
  padding: 0 5px;
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 10px;
`;

export const TaskStatusWrapperStyle: string = css`
  height: 40px;
  width: 195px;
  padding: 0 10px;
`;

export const TaskTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  width: 175px;
  margin: 0 10px;
  overflow: hidden;
`;
