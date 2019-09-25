// @flow
import { css } from 'react-emotion';
import { layout, colors, borderRadiuses, presets, fontSizes } from 'styles/common';

export const FilterWrapperStyle = (hasFilter: boolean): string => css`
  display: flex;
  align-items: center;
  border-radius: 25px;
  background-color: ${hasFilter ? colors.GRAY_SUPER_LIGHT : colors.TRANSPARENT};
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  position: absolute;
  left: 50px;
  z-index: 1;
  padding: 0 0 0 11px;
  height: 50px;
`;

export const BlueOutlineWrapperStyle = (hasFilter: boolean): string => css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  align-items: center;
  grid-gap: 20px;
  border: 4px solid ${hasFilter ? colors.BLUE_HALF : colors.TRANSPARENT};
  ${borderRadiuses.BUTTON};
  background-color: ${colors.WHITE};
  padding: 0 0 0 5px;
`;

export const ClearTotalButtonStyle: string = css`
  ${presets.BUTTON};
  width: 50px;
  height: 50px;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;
