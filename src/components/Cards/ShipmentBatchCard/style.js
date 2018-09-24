// @flow
import { css } from 'react-emotion';
import {
  fontSizes,
  fontSizesWithHeights,
  layout,
  colors,
  presets,
  borderRadiuses,
} from 'styles/common';

export const ProductWrapperStyle: string = css`
  position: relative;
  height: 85px;
  width: 195px;
`;

export const ProductImageStyle: string = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  width: 100%;
  height: 85px;
  object-fit: cover;
`;

export const ProductInfoWrapperStyle: string = css`
  position: absolute;
  top: 0;
  left: 0;
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background-color: rgba(0, 0, 0, 0.5);
  height: 85px;
  width: 195px;
`;

export const ProductNameStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.WHITE};
  font-weight: bold;
  ${presets.ELLIPSIS};
  padding: 0 0 0 10px;
  width: 175px;
`;

export const ProductSerialStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.WHITE};
  ${presets.ELLIPSIS};
  padding: 0 0 0 10px;
  width: 175px;
`;

export const ProductSupplierStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.WHITE};
  ${presets.ELLIPSIS};
  padding: 0 10px;
  & > svg {
    margin: 0 5px 0 0;
  }
`;

export const ProductIconLinkStyle: string = css`
  ${presets.BUTTON};
  position: absolute;
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  right: 0;
  top: 25px;
  width: 20px;
  height: 20px;
  &:hover {
    color: ${colors.TEAL};
  }
`;
export const ShipmentBatchCardWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  padding: 5px 0;
  width: 195px;
  height: 211px;
`;

export const BatchNoWrapperStyle: string = css`
  padding: 0 5px;
  width: 100%;
`;

export const QuantityWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 95px 90px;
  width: 100%;
  padding: 0 5px;
`;

export const DeliveryDateWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 95px 90px;
  width: 100%;
  padding: 0 5px;
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 10px;
`;

export const TotalPriceWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 90px 90px;
  width: 100%;
  padding: 0 10px 0 5px;
`;

export const VolumeWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 90px 90px;
  width: 100%;
  padding: 0 10px 0 5px;
`;

export const ShipmentWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 1fr;
  width: 100%;
  padding: 0 10px;
  align-items: center;
  grid-gap: 5px;
`;

export const ShipmentIconStyle = (hasShipment: boolean): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: 20px;
  height: 20px;
  background-color: ${hasShipment ? colors.TEAL : colors.GRAY_LIGHT};
  color: ${colors.WHITE};
  font-size: 11px;
  ${hasShipment &&
    `
      &:hover, :focus {
        background-color: ${colors.TEAL_DARK};
      }
    `};
`;

export const BatchTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  padding: 0 10px;
  overflow: hidden;
`;
