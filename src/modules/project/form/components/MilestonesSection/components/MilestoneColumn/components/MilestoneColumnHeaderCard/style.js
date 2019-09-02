// @flow
import { css } from 'react-emotion';
import {
  layout,
  shadows,
  colors,
  transitions,
  borderRadiuses,
  presets,
  fontSizes,
} from 'styles/common';

export const MilestoneHeaderWrapperStyle = (isDragging: boolean) => css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  justify-content: center;
  justify-items: center;
  ${transitions.MAIN};
  background-color: ${colors.WHITE};
  ${shadows.HEADER};
  padding: 10px 0;
  position: relative;
  ${isDragging &&
    `
    ${borderRadiuses.MAIN};
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `}
`;

export const DeleteButtonStyle = (isHovered: boolean) => css`
  position: absolute;
  bottom: 10px;
  left: 10px;
  ${presets.BUTTON};
  opacity: ${isHovered ? 1 : 0};
  height: 20px;
  width: 20px;
  ${borderRadiuses.CIRCLE};
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.MAIN};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export const TaskRingWrapperStyle = css`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;

export const AutoDateSyncIconStyle: string = css`
  width: 20px;
  height: 20px;
  color: ${colors.GRAY_VERY_LIGHT};
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.SMALL};
`;

export const DateInputWrapperStyle = (editable: boolean): string => css`
  display: grid;
  grid-template-columns: ${editable ? '80px 120px' : '80px 100px 20px'};
  width: 100%;
  padding: 0 5px;
`;
