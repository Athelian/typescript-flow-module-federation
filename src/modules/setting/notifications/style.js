// @flow
import { css } from 'react-emotion';
import {
  layout,
  presets,
  colors,
  fontSizes,
  fontSizesWithHeights,
  borderRadiuses,
  transitions,
} from 'styles/common';

export const NotificationsStyle = css`
  ${layout.LAYOUT};
  ${layout.JUSTIFIED_CENTER};
  user-select: none;
`;

export const WrapperStyle = css`
  ${presets.BOX};
  width: 100%;
  min-width: 250px;
  overflow: hidden;
`;

export const HeaderStyle = css`
  ${layout.HORIZONTAL};
  justify-content: space-between;
  align-items: center;
  margin: 10px;
`;

export const TitleStyle = css`
  white-space: nowrap;
  ${fontSizesWithHeights.SMALL};
  letter-spacing: 2px;
  color: ${colors.GRAY_DARK};
`;

export const ClearAllStyle = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  color: ${colors.BLUE};
  background-color: #fff;
  ${fontSizes.SMALL};
  ${transitions.MAIN};
  padding: 5px 10px;
  &:hover {
    color: ${colors.BLUE_DARK};
    background-color: ${colors.GRAY_VERY_LIGHT};
  }
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

export const ListWrapperStyle = css`
  ${layout.VERTICAL};
  max-height: 320px;
  overflow-x: hidden;
  overflow-y: overlay;
`;

export const ViewAllStyle = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  color: #fff;
  background-color: ${colors.BLUE};
  ${fontSizes.SMALL};
  ${transitions.MAIN};
  padding: 5px 10px;
  margin: 10px;
  text-align: center;
  &:hover {
    background-color: ${colors.BLUE_DARK};
  }
`;
