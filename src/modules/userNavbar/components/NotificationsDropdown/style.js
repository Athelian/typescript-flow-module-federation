// @flow
import { css } from 'react-emotion';
import {
  colors,
  borderRadiuses,
  transitions,
  scrollbars,
  shadows,
  fontSizes,
  presets,
} from 'styles/common';

export const NotificationsDropDownWrapperStyle = (isOpen: boolean): string => css`
  position: absolute;
  top: 35px;
  right: 0;
  display: flex;
  flex-direction: column;
  ${shadows.INPUT};
  width: 300px;
  background: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  height: ${isOpen ? '360px' : '0px'};
  ${transitions.EXPAND};
  overflow: hidden;
  padding: 40px 0 0 0;
`;

export const NotificationsBodyWrapperStyle: string = css`
  position: relative;
  height: 100%;
  width: 100%;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${scrollbars.SMALL};
  overflow-x: hidden;
  overflow-y: overlay;
`;

export const NotificationsHeaderStyle: string = css`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 40px;
  ${shadows.HEADER};
  ${borderRadiuses.MAIN};
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  background-color: ${colors.WHITE};
  padding: 0 10px;
  width: 100%;
`;

export const NotificationsIconStyle: string = css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
`;

export const NotificationsFooterStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 10px;
  width: 100%;
`;

export const NoNotificationStyle: string = css`
  display: flex;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.BLACK};
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 15px;
`;

export const ArchiveAllButtonStyle: string = css`
  ${presets.BUTTON};
  width: 30px;
  height: 30px;
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  ${borderRadiuses.CIRCLE};
  margin: 0 0 0 10px;
  &:hover {
    color: ${colors.GRAY_DARK};
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;
