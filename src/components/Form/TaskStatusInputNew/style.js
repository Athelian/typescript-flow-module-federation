// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, fontSizes, colors } from 'styles/common';

export const TaskStatusInputWrapperStyle = (status: string): string => {
  let statusStyle = '';
  if (status === 'unCompleted') {
    statusStyle = `
    background-color: ${colors.GRAY};
    color: ${colors.GRAY_DARK}
    `;
  }
  if (status === 'inProgress') {
    statusStyle = `
    background-color: ${colors.WHITE};
    color: ${colors.TEAL};
    border: 1px solid ${colors.TEAL};
    `;
  }
  if (status === 'skipped') {
    statusStyle = `
    background-color: ${colors.GRAY_DARK};
    color: ${colors.WHITE};
    `;
  }

  if (status === 'completed') {
    statusStyle = `
    background-color: ${colors.TEAL};
    color: ${colors.WHITE};
    `;
  }

  return css`
    ${presets.BUTTON};
    ${borderRadiuses.BUTTON};
    height: 40px;
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
  & > button {
    cursor: pointer;
  }
`;

export const TaskStatusLabelStyle = (clickable: boolean = false): string => css`
  ${presets.BUTTON};
  flex: 1;
  height: 100%;
  padding: 3px 3px 3px 0;
  border-radius: 0 50% 50% 0;
  color: inherit;

  cursor: ${clickable ? 'inherit' : 'default'};
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
  width: 70px;
  height: 20px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.GRAY};
`;
