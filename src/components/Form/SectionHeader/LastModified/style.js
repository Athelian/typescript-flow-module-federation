// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, layout } from 'styles/common';

export const LastModifiedWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  align-items: center;
`;

export const LastModifiedStyle = css`
  display: flex;
`;

export const UserIconStyle = css`
  display: flex;
  ${layout.CENTER_CENTER};
  color: #fff;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.GRAY_LIGHT};
  img {
    object-fit: cover;
  }
`;
