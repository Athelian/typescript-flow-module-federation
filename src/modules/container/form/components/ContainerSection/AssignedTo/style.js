// @flow
import { css } from 'react-emotion';
import { layout, presets, borderRadiuses, fontSizes, colors, shadows } from 'styles/common';

export const AssignmentWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  padding: 0 5px;
  width: 200px;
`;

export const AssignmentStyle: string = css`
  position: relative;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const RemoveAssignmentButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  height: 20px;
  width: 20px;
  background-color: ${colors.WHITE};
  ${shadows.INPUT};
  ${fontSizes.SMALL};
  position: absolute;
  top: -6px;
  right: -6px;
  opacity: 0;
  z-index: 1;
  &:hover,
  :focus {
    color: ${colors.RED};
    opacity: 1;
  }
`;

export const AddAssignmentButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  ${fontSizes.SMALL};
  border: 2px dashed ${colors.GRAY_LIGHT};
  color: ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    color: ${colors.TEAL};
    border-color: ${colors.TEAL};
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;
