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

export const OrderItemCardWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 200px;
  ${fontSizes.MAIN};
`;

export const ProductWrapperStyle = css`
  position: relative;
  height: 85px;
  width: 195px;
`;

export const ProductImageStyle = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  width: 100%;
  height: 85px;
  object-fit: cover;
`;

export const ProductInfoWrapperStyle = css`
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

export const ProductNameStyle = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.WHITE};
  font-weight: bold;
  ${presets.ELLIPSIS};
  padding: 0 0 0 10px;
  width: 175px;
`;

export const ProductSerialStyle = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.WHITE};
  ${presets.ELLIPSIS};
  padding: 0 0 0 10px;
  width: 175px;
`;

export const ProductSupplierStyle = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.WHITE};
  ${presets.ELLIPSIS};
  padding: 0 10px;
  & > svg {
    margin: 0 5px 0 0;
  }
`;

export const ProductTagsWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  padding: 0 10px;
  overflow: hidden;
`;

export const ProductIconLinkStyle = css`
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

export const BodyWrapperStyle = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  padding: 5px 0;
`;

export const QuantityWrapperStyle = css`
  display: grid;
  grid-template-columns: 95px 90px;
  width: 100%;
  padding: 0 5px;
`;

export const UnitPriceWrapperStyle = css`
  position: relative;
  display: grid;
  grid-template-columns: 95px 90px;
  width: 100%;
  padding: 0 5px;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const SyncButtonStyle = css`
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

export const DividerStyle = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 10px;
`;

export const TotalPriceWrapperStyle = css`
  display: grid;
  grid-template-columns: 90px 90px;
  width: 100%;
  padding: 0 10px 0 5px;
`;
