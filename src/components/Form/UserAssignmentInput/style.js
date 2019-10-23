// @flow
import { css } from 'react-emotion';
import { layout, presets, borderRadiuses, colors, shadows } from 'styles/common';

export const AssignmentWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  padding: 0 5px;
  width: 200px;
  height: 30px;
  align-items: center;
`;

export const AssignmentStyle: string = css`
  position: relative;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const RemoveAssignmentButtonStyle = (size: number): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  height: 20px;
  width: 20px;
  background-color: ${colors.WHITE};
  ${shadows.INPUT};
  font-size: ${size === 20 ? '10px' : '12px'};
  position: absolute;
  top: ${size === 20 ? '0' : '-6px'};
  right: ${size === 20 ? '0' : '-6px'};
  opacity: 0;
  z-index: 1;
  &:hover,
  :focus {
    color: ${colors.RED};
    opacity: 1;
  }
`;

export const AddAssignmentButtonStyle = (size: number): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: ${size}px;
  height: ${size}px;
  flex-shrink: 0;
  font-size: ${size === 20 ? '10px' : '12px'};
  border: 2px dashed ${colors.GRAY_LIGHT};
  color: ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    color: ${colors.TEAL};
    border-color: ${colors.TEAL};
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;
