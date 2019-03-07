// @flow
import { css } from 'react-emotion';
import {
  fontSizesWithHeights,
  colors,
  presets,
  layout,
  borderRadiuses,
  fontSizes,
} from 'styles/common';

export const WarehouseCardWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 195px;
  grid-template-rows: 135px 80px;
  width: 195px;
  height: 215px;
`;

export const WarehouseCardImageStyle: string = css`
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const WarehouseInfoWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  padding: 5px 0;
  width: 195px;
  grid-template-columns: 195px;
`;

export const WarehouseNameStyle: string = css`
  color: ${colors.BLACK};
  font-weight: bold;
  ${fontSizesWithHeights.MAIN};
  ${presets.ELLIPSIS};
  width: 100%;
  padding: 0 10px;
`;

export const OwnedByWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 0 5px;
  width: 175px;
  margin: 0 10px;
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  height: 18px;
`;

export const OwnedByIconStyle: string = css`
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
`;

export const OwnedByStyle: string = css`
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  width: 145px;
`;
