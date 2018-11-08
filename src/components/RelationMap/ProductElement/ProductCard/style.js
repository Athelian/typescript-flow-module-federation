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

export const OrderItemCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 183px;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
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
  font-size: 14px;
  line-height: 30px;
  height: 30px;
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

export const ProductTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  margin: 0 10px;
  overflow: hidden;
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

export const BodyWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  padding: 5px 0;
`;

export const QuantityWrapperStyle: string = css`
  width: 100%;
  padding: 0 5px;
`;

export const UnitPriceWrapperStyle: string = css`
  position: relative;
  width: 100%;
  padding: 0 5px;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const SyncButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  position: absolute;
  top: 0;
  left: 10px;
  opacity: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.TEAL};
  ${fontSizes.SMALL};
  letter-spacing: 2px;
  height: 20px;
  width: 80px;
  &:hover,
  :focus {
    background-color: ${colors.GRAY_VERY_LIGHT};
    color: ${colors.TEAL_DARK};
  }
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 10px;
`;

export const ChartWrapperStyle: string = css`
  width: 195px;
  padding: 0 10px;
  margin: 3px 0;
`;

export const TotalPriceWrapperStyle: string = css`
  width: 100%;
  padding: 0 5px;
`;
