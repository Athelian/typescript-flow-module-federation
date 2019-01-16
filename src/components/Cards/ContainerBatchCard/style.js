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

export const ContainerBatchCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 354px;
`;

export const ProductWrapperStyle: string = css`
  position: relative;
  height: 80px;
  width: 195px;
`;

export const ProductImageStyle: string = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  width: 100%;
  height: 80px;
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
  height: 80px;
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

export const RepresentIconStyle = (isRepresented: boolean) => css`
  position: absolute;
  bottom: 5px;
  right: 0;
  ${fontSizes.SMALL};
  width: 20px;
  height: 20px;
  ${presets.BUTTON};
  color: ${isRepresented ? colors.YELLOW : 'rgba(255, 255, 255, 0.5)'};
  &:hover,
  :focus {
    color: ${isRepresented ? colors.YELLOW_DARK : colors.WHITE};
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
  grid-template-columns: 195px;
  grid-gap: 5px;
  width: 195px;
  padding: 5px 0;
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

export const DateInputWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 65px 120px;
  width: 100%;
  padding: 0 5px;
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 10px;
`;

export const TotalPriceWrapperStyle: string = css`
  width: 100%;
  padding: 0 5px;
`;

export const VolumeWrapperStyle: string = css`
  width: 100%;
  padding: 0 5px;
`;

export const OrderWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 160px;
  width: 100%;
  padding: 0 10px;
  align-items: center;
  grid-gap: 5px;
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

export const OrderInChargeWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  width: 195px;
  padding: 0 5px;
`;

export const InChargeWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 6.25px;
  padding: 0 5px;
  width: 100%;
  height: 30px;
`;

export const BatchTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  width: 175px;
  margin: 0 10px;
  overflow: hidden;
`;
