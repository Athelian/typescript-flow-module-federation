// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, fontSizes, transitions, borderRadiuses } from 'styles/common';

export const AdjustmentWrapperStyle = css`
  display: flex;
  flex-direction: column;
  &:hover {
    & > div {
      & > button {
        opacity: 1;
      }
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
  grid-gap: 10px;
  ${transitions.EXPAND};
  height: ${isMemoOpen ? '200px' : '0'};
  overflow: hidden;
  border-left: 2px solid ${colors.GRAY_VERY_LIGHT};
  padding: 0 0 0 18px;
  margin-left: 5px;
`;

export const LastModifiedWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 0 0;
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 5px 0 0;
  img {
    object-fit: cover;
  }
`;
