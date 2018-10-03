// @flow
import { css } from 'react-emotion';
import {
  fontSizes,
  gradients,
  presets,
  colors,
  shadows,
  layout,
  borderRadiuses,
  transitions,
} from 'styles/common';

export const SettingsWrapperStyle: string = css`
  position: relative;
  display: flex;
  padding: 0 20px;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  height: 50px;
`;

export const NotificationButtonStyle: string = css`
  background: ${gradients.BLUE_TEAL_DIAGONAL};
  color: #fff;
  margin: 0 20px 0 0;
  ${presets.BUTTON};
  position: relative;
  ${fontSizes.MAIN};
  width: 30px;
  height: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  ${borderRadiuses.CIRCLE};
  &:hover,
  &:focus {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
`;

export const ProfileButtonStyle: string = css`
  ${presets.BUTTON};
  position: relative;
  ${borderRadiuses.CIRCLE};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  &:hover,
  &:focus {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
`;

export const NotificationBadgeStyle: string = css`
  position: absolute;
  border-radius: 8px;
  background-color: ${colors.RED};
  color: #fff;
  ${fontSizes.SMALL};
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  top: -4px;
  right: -4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const DropDownStyle: string = css`
  position: absolute;
  top: 60px;
  min-width: min-content;
  min-height: min-content;
`;

export const DropDownWrapperStyle: string = css`
  ${DropDownStyle};
  right: 20px;
`;

export const NotificationDropDownWrapperStyle: string = css`
  ${DropDownStyle};
  right: 66px;
`;

export const SubMenuWrapperStyle: string = css`
  ${layout.VERTICAL};
  ${presets.BOX};
  ${shadows.NAV_BUTTON};
  width: 200px;
`;

export const SubMenuItemStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  height: 50px;
  cursor: pointer;
  ${transitions.MAIN};

  & > div:first-child {
    display: flex;
    ${layout.CENTER_CENTER};
    width: 50px;
    height: 100%;
    font-size: 20px;
    color: #ccc;
  }

  & > div:nth-child(2) {
    ${fontSizes.MAIN};
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #aaa;
    flex: 1;
  }

  &:hover {
    background-color: #eee;
    & > div:first-child {
      color: #aaa;
    }
    & > div:nth-child(2) {
      color: #555;
    }
  }
`;
