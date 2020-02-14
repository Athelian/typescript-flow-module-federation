// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes, borderRadiuses } from 'styles/common';

export const NotificationRowMiniWrapperStyle: string = css`
  display: flex;
  width: 100%;
  padding: 0 10px;
  ${transitions.MAIN};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  min-height: 60px;
  &:hover {
    background-color: ${colors.WHITE};
  }
`;

export const NotificationRowMiniBodyStyle: string = css`
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
  top: 18px;
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
`;

export const NotificationMessageStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const NotificationDateStyle: string = css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
`;
