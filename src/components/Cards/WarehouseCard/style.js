// @flow
import { css } from 'react-emotion';
import { fontSizesWithHeights, colors, presets, layout } from 'styles/common';

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
