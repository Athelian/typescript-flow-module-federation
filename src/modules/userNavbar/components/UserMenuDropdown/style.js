// @flow
import { css } from 'react-emotion';
import { fontSizes, presets, colors, shadows, borderRadiuses, transitions } from 'styles/common';

export const UserMenuDropDownWrapperStyle = (isOpen: boolean, isShowImport: boolean): string => css`
  position: absolute;
  top: 55px;
  right: 0;
  display: flex;
  flex-direction: column;
  ${shadows.INPUT};
  width: 150px;
  background: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  height: ${isOpen ? (isShowImport ? '120px' : '80px') : '0px'};
  ${transitions.EXPAND};
  overflow: hidden;
`;

export const UserMenuItemWrapperStyle: string = css`
  ${presets.BUTTON};
  height: 40px;
  width: 150px;
  justify-content: flex-start;
  background-color: ${colors.WHITE};
  &:hover,
  :focus {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const UserMenuItemIconStyle: string = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
`;

export const UserMenuItemStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  text-align: right;
  width: 100%;
`;
