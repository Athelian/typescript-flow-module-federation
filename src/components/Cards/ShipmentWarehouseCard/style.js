// @flow
import { css } from 'react-emotion';
import {
  fontSizesWithHeights,
  colors,
  presets,
  borderRadiuses,
  layout,
  fontSizes,
} from 'styles/common';

export const ShipmentWarehouseCardWrapperStyle: string = css`
  position: relative;
  display: flex;
  width: 195px;
  height: 40px;
`;

export const ShipmentWarehouseCardImageStyle: string = css`
  ${borderRadiuses.MAIN};
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ShipmentWarehouseInfoWrapperStyle: string = css`
  position: absolute;
  top: 0;
  left: 0;
  align-items: center;
  width: 195px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  ${borderRadiuses.MAIN};
`;

export const WarehouseNameStyle: string = css`
  color: ${colors.WHITE};
  font-weight: bold;
  ${fontSizesWithHeights.MAIN};
  ${presets.ELLIPSIS};
  width: 100%;
  padding: 0 20px 0 10px;
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
