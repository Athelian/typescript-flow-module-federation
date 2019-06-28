// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, fontSizes, colors, shadows } from 'styles/common';

type TaskStatusInputWrapperStyleType = {
  isCompleted: boolean,
  editable: boolean,
};

export const TaskStatusInputWrapperStyle = ({
  isCompleted,
  editable,
}: TaskStatusInputWrapperStyleType): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  height: 40px;
  width: 200px;
  border: 2px solid ${colors.TRANSPARENT};
  ${isCompleted
    ? `
      background-color: ${colors.TEAL};
      color: ${colors.WHITE};
      cursor: inherit;
    `
    : `
      background-color: ${colors.GRAY_SUPER_LIGHT};
      color: ${colors.GRAY_DARK};
      ${
        editable
          ? `
        &:hover, :focus {
          background-color: ${colors.GRAY_VERY_LIGHT};
        }
      `
          : `
        cursor: inherit;
      `
      }
    `};
`;

export const UserAvatarWrapperStyle: string = css`
  position: relative;
  margin: 3px 0 3px 3px;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
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

export const TaskStatusButtonStyle: string = css`
  ${presets.BUTTON};
  flex: 1;
  height: 100%;
  padding: 3px 3px 3px 0;
  border-radius: 0 50% 50% 0;
  color: inherit;
  cursor: inherit;
`;

export const TaskStatusInputLabelStyle: string = css`
  flex: 1;
`;

export const StatusLabelStyle: string = css`
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  letter-spacing: 2px;
  user-select: none;
  text-transform: uppercase;
  text-align: center;
`;
