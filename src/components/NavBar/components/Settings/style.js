// @flow
import { css } from 'react-emotion';
import { fontSizes, gradients, presets, colors, shadows, layout, transitions } from 'styles/common';

export const SettingsWrapperStyle = css`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9998;
  user-select: none;
  margin: 20px 20px 0 0;
  height: 40px;
  display: flex;
  align-items: center;
`;

export const SettingsBodyStyle = css`
  display: flex;
  align-items: center;
  background-color: ${gradients.BLUE_TEAL_DIAGONAL};
  & > button {
    ${presets.BUTTON};
    position: relative;
    font-size: 20px;
    width: 40px;
    height: 40px;
    margin: 0 8px;
    color: ${colors.BLUE};
    transition: all ease-in 0.2s;
    outline: none;
    &:first-child {
      background: ${gradients.BLUE_TEAL_DIAGONAL};
      color: #fff;
      border-radius: 50%;
    }
    &:nth-child(2) {
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
    }
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
    }
  }
`;

export const SettingsCountStyle = css`
  position: absolute;
  border-radius: 100%;
  background-color: ${colors.RED};
  color: #fff;
  font-size: 10px;
  min-width: 20px;
  min-height: 20px;
  top: -8px;
  right: -8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.99);
`;

export const DropdownWrapperStyle = css`
  position: absolute;
  top: 40px;
  right: 0;
  min-width: min-content;
  min-height: min-content;
  margin-top: 10px;
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
  ${fontSizes.MEDIUM};
  padding: 10px;
  cursor: pointer;
  color: ${colors.BLACK};
  white-space: nowrap;
  text-transform: uppercase;
  ${transitions.MAIN};
  & > svg {
    margin-right: 10px;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
