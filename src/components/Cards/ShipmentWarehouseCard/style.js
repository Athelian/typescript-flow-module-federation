// @flow
import { css } from 'react-emotion';
import { fontSizesWithHeights, colors, presets, borderRadiuses } from 'styles/common';

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
  display: flex;
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
