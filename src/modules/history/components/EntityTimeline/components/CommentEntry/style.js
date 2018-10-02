// @flow
import { css } from 'react-emotion';
import {
  presets,
  layout,
  colors,
  borderRadiuses,
  fontSizes,
  fontSizesWithHeights,
  shadows,
} from 'styles/common';

export const WrapperStyle = (isSameUser: boolean) => css`
  ${layout.HORIZONTAL};
  z-index: 1;
  justify-content: ${isSameUser ? 'flex-end' : 'flex-start'};
  &:hover {
    button {
      opacity: 1;
    }
  }
`;

export const ContentWrapperStyle = (isSameUser: boolean) => css`
  ${layout.VERTICAL};
  align-items: ${isSameUser ? 'flex-end' : 'flex-start'};
  margin: ${isSameUser ? '0 0 0 70px' : '0 70px 0 0'};
  flex: 1;
`;

export const NameDateWrapperStyle = (isSameUser: boolean) => css`
  display: flex;
  margin: 0 0 5px 0;
  align-items: center;
  justify-content: ${isSameUser ? 'flex-end' : 'flex-start'};
`;

export const DateStyle = (isSameUser: boolean) => css`
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  user-select: none;
  margin: ${isSameUser ? '0 5px 0 0' : '0 0 0 5px'};
`;

export const NameStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
`;

export const BodyWrapperStyle = (isSameUser: boolean) => css`
  ${layout.VERTICAL};
  position: relative;
  padding: 20px;
  width: 100%;
  color: ${colors.BLACK};
  ${isSameUser
    ? `
    border-radius: 10px 0 10px 10px;
    background-color: ${colors.TEAL_LIGHT};
    margin-left: auto
  `
    : `
    border-radius: 0 10px 10px 10px;
    background-color: ${colors.GRAY_SUPER_LIGHT};
    margin-right: auto
  `};
`;

export const BodyStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  white-space: pre-line;
`;

export const AvatarStyle = (isSameUser: boolean) => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  ${fontSizesWithHeights.HUGE};
  position: relative;
  background-color: ${isSameUser ? colors.TEAL : colors.GRAY};
  color: #fff;
  width: 50px;
  height: 50px;
  margin: ${isSameUser ? '0 0 0 20px' : '0 20px 0 0'};
  user-select: none;
  font-weight: bold;
  flex-shrink: 0;
  &:hover {
    background-color: ${isSameUser ? colors.TEAL_DARK : colors.GRAY_DARK};
    ${shadows.TOOLTIP};
  }
`;

export const EditButtonStyle = css`
  position: absolute;
  top: 5px;
  right: 5px;
  ${presets.BUTTON};
  color: ${colors.GRAY_DARK};
  flex-shrink: 0;
  ${fontSizes.SMALL};
  opacity: 0;
  z-index: 5;
  ${borderRadiuses.CIRCLE};
  width: 20px;
  height: 20px;
  &:hover {
    background-color: #fff;
    color: ${colors.TEAL};
  }
`;

export const MessageInputWrapperStyle = css`
  ${layout.VERTICAL};
  width: 100%;
  min-width: 200px;
`;

export const FormButtonsWrapperStyle = css`
  ${layout.HORIZONTAL};
  margin: 10px 0 0 0;
`;

export const DeleteButtonStyle = css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  ${shadows.NAV_BUTTON};
  ${fontSizes.MAIN};
  position: absolute;
  top: -12.5px;
  left: -12.5px;
  background-color: #fff;
  color: ${colors.GRAY_LIGHT};
  height: 25px;
  width: 25px;
  z-index: 2;
  &:hover {
    ${shadows.NAV_BUTTON_HOVER};
    color: ${colors.RED};
  }
  &:focus {
    color: ${colors.RED};
    border: 1px solid ${colors.RED};
  }
`;

export const CancelButtonStyle = css`
  ${presets.BUTTON};
  color: ${colors.GRAY_DARK};
  background-color: none;
  flex-shrink: 0;
  ${fontSizes.SMALL};
  ${borderRadiuses.MAIN};
  padding: 3px 5px;
  letter-spacing: 2px;
  margin: 0 10px 0 0;
  &:hover {
    background-color: ${colors.GRAY_DARK};
    color: #fff;
  }
`;
