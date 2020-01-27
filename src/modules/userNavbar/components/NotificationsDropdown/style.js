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
  height: calc(100% - 40px);
  width: 100%;
  overflow: hidden;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${scrollbars.SMALL};
  &:hover {
    overflow-x: hidden;
    overflow-y: overlay;
  }
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
  & > div,
  a {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    display: flex;
    align-items: center;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
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
  ${borderRadiuses.MAIN};
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0 10px;
  width: 100%;
`;

export const NoNotificationStyle = css`
  display: flex;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.BLACK};
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 15px;
`;

export const ArchiveAllButtonStyle = css`
  & > button {
    font-weight: 900;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 2px;
    text-transform: uppercase;
    min-width: 30px;
    padding: 0;
  }
`;

export const ViewMoreStyle = css`
  padding: 5px 0;
  font-size: 12px;
  line-height: 15px;
  display: block;
  align-items: center;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #aaaaaa;
`;
