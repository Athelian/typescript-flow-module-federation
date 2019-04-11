// @flow
import { css } from 'react-emotion';
import { layout, presets, borderRadiuses, colors, fontSizes } from 'styles/common';

export const TaskFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

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

export const ApprovalToggleWrapperStyle: string = css`
  display: flex;
  width: 100%;
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  justify-content: flex-end;
  align-items: center;
`;

export const AutoDateWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;

export const AutoDateBackgroundStyle = (position: 'top' | 'bottom'): string => css`
  position: absolute;
  width: 235px;
  height: ${position === 'top' ? '40px' : '80px'};
  top: ${position === 'top' ? '-5px' : '35px'};
  right: -30px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  border-radius: 7.5px;
`;

export const AutoDateOffsetWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
`;

export const RadioWrapperStyle = (position: 'top' | 'bottom'): string => css`
  position: absolute;
  right: -25px;
  top: ${position === 'top' ? '5px' : '45px'};
`;
