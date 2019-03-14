// @flow
import { css } from 'react-emotion';
import {
  colors,
  layout,
  shadows,
  fontSizesWithHeights,
  borderRadiuses,
  transitions,
} from 'styles/common';

export const MainNameStyle = css`
  ${borderRadiuses.MAIN};
  padding: 0 2px;
  background-color: ${colors.WHITE};
  cursor: default;
  &:hover {
    ${transitions.MAIN};
    color: ${colors.WHITE};
    background-color: rgba(17, 209, 166, 0.4);
  }
`;

export const UserWrapperStyle = css`
  ${shadows.TOOLTIP};
  background-color: ${colors.WHITE};
  padding: 0;

  & > .tippy-roundarrow {
    fill: ${colors.WHITE};
  }
`;

export const ContentWrapperStyle = css`
  ${layout.HORIZONTAL};
`;

export const AvatarWrapperStyle = css`
  padding: 10px;
`;

export const InfoWrapperStyle = css`
  ${layout.VERTICAL};
  align-items: start;
  padding: 5px 10px 10px 0;
`;

export const NameStyle = css`
  ${fontSizesWithHeights.MAIN};
  font-weight: 600;
  color: ${colors.BLACK};
  padding-bottom: 5px;
`;

export const GroupStyle = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.GRAY_DARK};
`;

export const EmailStyle = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.GRAY_DARK};
`;

export const RolesStyle = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  & > svg {
    margin: 0 5px 0 0;
    color: ${colors.GRAY_DARK};
  }
`;
