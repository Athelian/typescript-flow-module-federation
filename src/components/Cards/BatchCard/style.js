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

export const BatchCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 359px;
`;

export const ProductWrapperStyle: string = css`
  position: relative;
  height: 75px;
  width: 195px;
`;

export const ProductImageStyle: string = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  width: 100%;
  height: 75px;
  object-fit: contain;
`;

export const ProductInfoWrapperStyle: string = css`
  position: absolute;
  top: 0;
  left: 0;
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  background-color: rgba(0, 0, 0, 0.5);
  height: 75px;
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

export const BatchInfoWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 185px;
  grid-gap: 5px;
  padding: 5px;
  width: 195px;
`;

export const BatchNoWrapperStyle: string = css`
  width: 100%;
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 5px;
`;

export const OrderWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 160px;
  width: 100%;
  padding: 0 0 0 5px;
  align-items: center;
`;

export const OrderIconStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 20px;
  height: 20px;
  background-color: ${colors.TEAL};
  color: ${colors.WHITE};
  font-size: 11px;
  &:hover,
  :focus {
    background-color: ${colors.TEAL_DARK};
  }
`;

export const ShipmentWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 160px;
  width: 100%;
  padding: 0 0 0 5px;
  align-items: center;
`;

export const ShipmentIconStyle = (hasShipment: boolean): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 20px;
  height: 20px;
  background-color: ${hasShipment ? colors.TEAL : colors.GRAY_VERY_LIGHT};
  color: ${colors.WHITE};
  font-size: 11px;
  ${hasShipment &&
    `
      &:hover, :focus {
        background-color: ${colors.TEAL_DARK};
      }
    `};
`;

export const ContainerWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 160px;
  width: 100%;
  padding: 0 0 0 5px;
  align-items: center;
`;

export const ContainerIconStyle = (hasContainer: boolean): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 20px;
  height: 20px;
  background-color: ${hasContainer ? colors.TEAL : colors.GRAY_VERY_LIGHT};
  color: ${colors.WHITE};
  font-size: 11px;
  ${hasContainer &&
    `
      &:hover, :focus {
        background-color: ${colors.TEAL_DARK};
      }
    `};
`;

export const BatchTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  width: 175px;
  margin: 0 5px;
  overflow: hidden;
`;
