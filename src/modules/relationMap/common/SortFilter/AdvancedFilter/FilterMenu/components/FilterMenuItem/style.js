// @flow
import { css } from 'react-emotion';
import {
  presets,
  colors,
  fontSizesWithHeights,
  fontSizes,
  borderRadiuses,
  shadows,
} from 'styles/common';

export const FilterMenuItemWrapperStyle = (isActive: boolean): string => css`
  ${presets.BUTTON};
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  flex-shrink: 0;
  ${isActive
    ? `
      background-color: ${colors.WHITE};
      color: ${colors.TEAL};
      ${shadows.INPUT};
    `
    : `
      color: ${colors.GRAY_DARK};
      &:hover, :focus {
        background-color: ${colors.WHITE};
        ${shadows.INPUT};
      }
    `};
`;

export const FilterMenuItemStyle: string = css`
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-template-rows: 40px;
  width: 100%;
  height: 40px;
  flex-shrink: 0;
  align-items: center;
`;

export const FilterMenuLabelStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  letter-spacing: 2px;
  ${presets.ELLIPSIS};
  text-align: left;
`;

export const FilterDataWrapperStyle: string = css`
  display: flex;
  flex-wrap: wrap;
  padding: 0 5px 0 35px;
  width: 100%;
`;

export const FilterDataStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_LIGHT};
  color: ${colors.WHITE};
  padding: 0 5px 0 10px;
  margin: 0 5px 10px 5px;
  height: 20px;
  ${fontSizes.SMALL};
  line-height: 20px;
  &:hover,
  :focus {
    background-color: ${colors.GRAY_DARK};
  }
`;
