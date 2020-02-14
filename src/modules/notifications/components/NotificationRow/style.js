// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes, borderRadiuses, presets } from 'styles/common';

export const NotificationRowWrapperStyle: string = css`
  display: flex;
  width: 100%;
  padding: 0 20px;
  cursor: pointer;
  ${transitions.MAIN};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  min-height: 60px;
  &:hover {
    background-color: ${colors.WHITE};
  }
`;

export const NotificationRowBodyStyle: string = css`
  display: flex;
  flex: 1;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

export const AvatarIconWrapperStyle: string = css`
  position: relative;
`;

export const NotificationTypeStyle = (color: string): string => css`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  width: 22px;
  border: 2px solid ${colors.GRAY_SUPER_LIGHT};
  right: -2px;
  top: 30px;
  ${borderRadiuses.CIRCLE};
  background-color: ${colors[color]};
  color: ${colors.WHITE};
  font-size: 11px;
`;

export const NotificationMessageWrapperStyle: string = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 0 0 10px;
  justify-content: center;
`;

export const NotificationMessageStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;

export const NotificationDateStyle: string = css`
  display: flex;
  flex-wrap: wrap;
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
`;

export const NotificationAgoStyle: string = css`
  padding: 0 5px 0 0;
`;

export const ArchiveButtonWrapperStyle: string = css`
  display: flex;
  align-items: center;
`;

export const ArchiveButtonStyle: string = css`
  ${presets.BUTTON};
  width: 40px;
  height: 40px;
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  ${borderRadiuses.CIRCLE};
  &:hover {
    color: ${colors.GRAY_DARK};
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;
