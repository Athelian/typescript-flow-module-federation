// @flow
import { css } from 'react-emotion';
import { layout, presets, borderRadiuses, fontSizes, colors, shadows } from 'styles/common';

export const TaskAssignmentWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 6.333px;
  padding: 5px 0;
  height: 40px;
`;

export const TaskAssignmentStyle: string = css`
  position: relative;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const UserStyle = (isActiveUser: boolean, clickable: boolean): string => css`
  ${borderRadiuses.CIRCLE};
  ${isActiveUser
    ? `
    opacity: 1;
  `
    : `
    ${
      clickable
        ? `
          opacity: 0.5;
        ${presets.BUTTON};
        &:hover, :focus {
          opacity: 1;
        }
        `
        : `
        opacity: 0.5 !important;
        `
    };
  `}
`;

export const DeactivateButtonStyle: string = css`
  position: absolute;
  top: 0;
  ${presets.BUTTON};
  opacity: 0;
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  color: ${colors.GRAY_LIGHT};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  ${shadows.DROPDOWN};
  &:hover,
  :focus {
    color: ${colors.RED};
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
  top: -8px;
  right: -8px;
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
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const ConfirmIconWrapperStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  ${borderRadiuses.CIRCLE};
  ${fontSizes.MAIN};
  background-color: ${colors.GRAY_LIGHT};
  ${shadows.FAINT};
  user-select: none;
`;
