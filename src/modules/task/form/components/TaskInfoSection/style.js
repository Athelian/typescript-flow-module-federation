// @flow
import { css } from 'react-emotion';
import { layout, presets, borderRadiuses, colors } from 'styles/common';

export const TaskSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 10px;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
`;

export const MainFieldsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
  padding: 0 90px;
`;

export const MemoWrapperStyle: string = css`
  margin: 0 90px;
`;

export const TaskStatusWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: 680px;
  margin: 0 90px;
  padding: 20px;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
`;

export const AssignedToStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;

export const TaskFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;
