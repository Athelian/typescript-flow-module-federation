// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, fontSizes, colors, shadows } from 'styles/common';

export const TaskApprovalStatusInputWrapperStyle = (
  isApproved: boolean,
  width: string
): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  height: 40px;
  width: ${width};
  cursor: inherit;
  padding: 5px;
  ${isApproved
    ? `
    background-color: ${colors.BLUE};
    color: ${colors.WHITE};
  `
    : `
    background-color: ${colors.RED};
    color: ${colors.WHITE};
  `};
`;

export const UserAvatarWrapperStyle: string = css`
  position: relative;
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
  cursor: inherit;
  ${shadows.DROPDOWN};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export const StatusLabelWrapperStyle: string = css`
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
