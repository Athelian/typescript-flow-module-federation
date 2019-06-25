// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, fontSizes, colors, shadows } from 'styles/common';

type TaskStatusInputWrapperStyleType = {
  status: string,
  editable: Object,
  width: string,
};

export const TaskStatusInputWrapperStyle = ({
  status,
  editable,
  width,
}: TaskStatusInputWrapperStyleType): string => {
  let statusStyle = '';
  if (status === 'unCompleted') {
    statusStyle = `
      background-color: ${colors.GRAY_LIGHT};
      color: ${colors.GRAY_DARK};
      ${
        editable.inProgress
          ? `
        &:hover, :focus {
          background-color: ${colors.GRAY_VERY_LIGHT};
        }
      `
          : `
        cursor: inherit;
      `
      }
    `;
  }
  if (status === 'inProgress') {
    statusStyle = `
      background-color: ${colors.WHITE};
      color: ${colors.TEAL};
      border-color: ${colors.TEAL};
      ${
        editable.completed
          ? `
        &:hover, :focus {
          background-color: ${colors.GRAY_SUPER_LIGHT};
        }
      `
          : `
        cursor: inherit;
      `
      }
    `;
  }
  if (status === 'skipped') {
    statusStyle = `
      background-color: ${colors.GRAY_LIGHT};
      color: ${colors.BLACK};
      cursor: inherit;
    `;
  }
  if (status === 'completed') {
    statusStyle = `
      background-color: ${colors.TEAL};
      color: ${colors.WHITE};
      cursor: inherit;
    `;
  }

  return css`
    ${presets.BUTTON};
    ${borderRadiuses.BUTTON};
    height: 40px;
    width: ${width};
    border: 2px solid ${colors.TRANSPARENT};
    ${statusStyle}
  `;
};

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

export const SkipButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  width: min-content;
  height: 20px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  color: ${colors.GRAY_DARK};
  letter-spacing: 2px;
  ${fontSizes.SMALL};
  margin: 5px 0 0 0;
  padding: 0 10px;
  &:hover,
  :focus {
    background-color: ${colors.GRAY_LIGHT};
    color: ${colors.BLACK};
  }
`;
