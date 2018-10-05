// @flow
import { css } from 'react-emotion';
import { layout, colors, borderRadiuses, transitions, scrollbars, shadows } from 'styles/common';

export const NotificationsDropDownWrapperStyle = (isOpen: boolean) => css`
  position: absolute;
  top: 55px;
  right: 0;
  display: flex;
  flex-direction: column;
  ${shadows.INPUT};
  width: 300px;
  background: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  height: ${isOpen ? '400px' : '0px'};
  ${transitions.EXPAND};
  overflow: hidden;
`;

export const NotificationsBodyWrapperStyle: string = css`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const NotificationsListWrapperStyle: string = css`
  position: absolute;
  ${layout.VERTICAL};
  top: 40px;
  left: 0;
  height: calc(100% - 80px);
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

export const NotificationsHeaderStyle: boolean = css`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 40px;
  flex-shrink: 0;
  ${shadows.HEADER};
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  background-color: ${colors.WHITE};
  padding: 0 10px;
  width: 100%;
`;

export const NotificationsFooterStyle: boolean = css`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  flex-shrink: 0;
  ${shadows.HEADER_REVERSE};
  ${borderRadiuses.MAIN};
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  background-color: ${colors.WHITE};
  padding: 0 10px;
  width: 100%;
`;

export const NoNotificationStyle = css`
  display: flex;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.GRAY_DARK};
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  font-size: 15px;
`;
