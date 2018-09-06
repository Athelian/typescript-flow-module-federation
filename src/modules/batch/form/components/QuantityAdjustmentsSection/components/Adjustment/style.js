// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, fontSizes, transitions, borderRadiuses } from 'styles/common';

export const AdjustmentWrapperStyle = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  &:hover {
    button {
      opacity: 1;
    }
  }
`;

export const AdjustmentFieldsWrapperStyle = css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
`;

export const MemoButtonStyle = (isMemoOpen: boolean, hasMemo: boolean) => css`
  position: absolute;
  width: 30px;
  height: 30px;
  left: -30px;
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  opacity: ${isMemoOpen || hasMemo ? '1' : '0'};
  ${hasMemo ? `color: ${colors.GRAY_DARK}` : `color: ${colors.GRAY_LIGHT}`};
  ${isMemoOpen && `color: ${colors.BLUE}`};
  ${isMemoOpen
    ? `
      &:hover, :focus {
        color: ${colors.BLUE_DARK};
      }
    `
    : `
      &:hover, :focus {
        color: ${colors.BLUE};
      }
    `};
`;

export const RemoveButtonStyle = css`
  position: absolute;
  width: 30px;
  height: 30px;
  right: -30px;
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  opacity: 0;
  color: ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export const MemoSectionWrapperStyle = (isMemoOpen: boolean) => css`
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  ${transitions.EXPAND};
  height: ${isMemoOpen ? '200px' : '0'};
  overflow: hidden;
  border-left: 2px solid ${colors.GRAY_VERY_LIGHT};
  padding: 0 0 0 20px;
`;

export const LastModifiedWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
