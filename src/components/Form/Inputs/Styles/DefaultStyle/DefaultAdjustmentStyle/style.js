// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, fontSizes, transitions } from 'styles/common';

export const AdjustmentWrapperStyle: string = css`
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

export const AdjustmentFieldsWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
`;

export const MemoButtonStyle = (isMemoOpen: boolean, hasMemo: boolean): string => css`
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

export const RemoveButtonStyle: string = css`
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

export const MemoSectionWrapperStyle = (isMemoOpen: boolean): string => css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  ${transitions.EXPAND};
  height: ${isMemoOpen ? '210px' : '0'};
  overflow: hidden;
  border-left: 2px solid ${colors.GRAY_VERY_LIGHT};
  padding: 0 0 0 18px;
  margin-left: 5px;
`;

export const LastModifiedWrapperStyle: string = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 0 0;
`;

export const MemoStyle: string = css`
  padding: 10px 0 0 0;
`;

export const UserIconStyle: string = css`
  margin: 0 5px 0 0;
`;
