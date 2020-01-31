// @flow
import { css } from 'react-emotion';
import { layout, presets, borderRadiuses, colors, transitions, fontSizes } from 'styles/common';

export const FollowersWrapperStyle = (editable: boolean): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  height: 30px;
  padding: 0 5px 0 0;
  ${editable
    ? `
    &:hover {
      background-color: ${colors.GRAY_VERY_LIGHT};
      & > div {
        border-color: ${colors.TEAL};
        color: ${colors.TEAL};
        & > div {
          border-color: ${colors.GRAY_VERY_LIGHT};
        }
      }
    }
  `
    : `
    cursor: default;
  `}
`;

export const AvatarsWrapperStyle: string = css`
    ${layout.GRID_HORIZONTAL};
    grid-gap: 1px;};
`;

export const AvatarWrapperStyle: string = css`
  ${borderRadiuses.CIRCLE};
  border: 2px solid ${colors.GRAY_SUPER_LIGHT};
  ${transitions.MAIN};
`;

export const StackedAvatarsWrapperStyle = (maxFollowersShown: number): string => css`
  height: 24px;
  position: relative;
  display: flex;
  width: ${(maxFollowersShown + 1) * 16 + 8}px;
`;

export const StackedAvatarWrapperStyle = (index: number): string => css`
  ${borderRadiuses.CIRCLE};
  border: 2px solid ${colors.GRAY_SUPER_LIGHT};
  ${transitions.MAIN};
  position: absolute;
  top: 0;
  left: ${index * 16}px;
`;

export const StackedMoreStyle = (maxFollowersShown: number): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadiuses.CIRCLE};
  border: 2px solid ${colors.GRAY_SUPER_LIGHT};
  background-color: ${colors.WHITE};
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
  ${transitions.MAIN};
  position: absolute;
  top: 0;
  left: ${maxFollowersShown * 16}px;
  width: 24px;
  height: 24px;
`;

export const PlusButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  font-size: 10px;
  border: 2px dashed ${colors.GRAY_LIGHT};
  color: ${colors.GRAY_LIGHT};
`;
