// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, shadows, presets, borderRadiuses } from 'styles/common';

export const NotificationPreferencesModalWrapperStyle: string = css`
  ${layout.VERTICAL};
`;

export const NavbarWrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: -100px;
  z-index: 1;
  height: 50px;
  ${shadows.HEADER};
  padding: 0 10px 0 20px;
  background-color: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;

export const NavbarLeftWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
`;

export const EmailNotificationsWrapperStyle = (isEmailNotificationsEnabled: boolean): string => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  align-items: center;
  color: ${isEmailNotificationsEnabled ? colors.TEAL : colors.GRAY_LIGHT};
  ${fontSizes.MAIN};
  font-weight: bold;
  white-space: nowrap;
`;

export const NavbarRightWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
`;

export const InfoTooltipWrapperStyle: string = css`
  ${presets.BUTTON};
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.MAIN};
  width: 30px;
  height: 30px;
`;
