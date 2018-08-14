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

export const SettingsWrapperStyle = css`
  position: relative;
  display: flex;
  padding: 0 20px;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  height: 50px;
`;

const ButtonStyle = css`
  ${presets.BUTTON};
  position: relative;
  ${fontSizes.HUGE};
  width: 30px;
  height: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  ${borderRadiuses.CIRCLE};
  &:hover,
  &:focus {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
`;

export const NotificationButtonStyle = css`
  ${ButtonStyle};
  background: ${gradients.BLUE_TEAL_DIAGONAL};
  color: #fff;
  margin: 0 20px 0 0;
`;

export const ProfileButtonStyle = css`
  ${ButtonStyle};
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
`;

export const NotificationBadgeStyle = css`
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

const DropDownStyle = css`
  position: absolute;
  top: 60px;
  min-width: min-content;
  min-height: min-content;
`;

export const DropDownWrapperStyle = css`
  ${DropDownStyle};
  right: 20px;
`;

export const NotificationDropDownWrapperStyle = css`
  ${DropDownStyle};
  right: 66px;
`;

export const SubMenuWrapperStyle = css`
  ${layout.VERTICAL};
  ${presets.BOX};
  ${shadows.NAV_BUTTON};
  width: 200px;
`;

export const SubMenuItemStyle = css`
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
