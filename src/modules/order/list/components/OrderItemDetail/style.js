// @flow
import { css } from 'react-emotion';
import {
  presets,
  shadows,
  colors,
  borderRadiuses,
  fontSizesWithHeights,
  fontSizes,
  layout,
} from 'styles/common';

export const OrderItemWrapperStyle = css`
  position: relative;
`;

export const OrderItemStyle = css`
  background-color: #fff;
  ${shadows.WATERFALL};
  ${borderRadiuses.MAIN};
  display: flex;
  flex-direction: column;
  width: 180px;
  height: min-content;
  padding: 10px;
`;

export const ProductItemStyle = css`
  display: flex;
  div {
    img {
      margin-right: 10px;
    }
    &:nth-child(2) {
      ${presets.ELLIPSIS};
    }
  }
  margin-bottom: 8px;
`;

export const ImageStyle = css`
  border-radius: 2px 2px 0 0;
  height: 50px;
  width: 50px;
  ${borderRadiuses.CIRCLE};
  object-fit: cover;
  overflow: hidden;
  background-color: #ccc;
  user-select: none;
  margin-bottom: 8px;
`;

export const ProductNameStyle = css`
  ${fontSizesWithHeights.LARGE};
  color: ${colors.BLACK};
  font-weight: bold;
`;

export const ProductSerialStyle = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.GRAY_DARK};
`;

export const SupplierStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.MEDIUM};
  color: ${colors.BLACK};
  font-weight: bold;
  & > svg {
    margin: 0 5px 0 0;
  }
`;

export const IconStyle = css`
  color: ${colors.GRAY_DARK};
`;

export const QuantitiesWrapper = css`
  display: flex;
  flex-direction: column;
  width: 90px;
  height: 80px;
  justify-content: center;
`;

export const QuantityStyle = (color: string) => css`
  color: ${colors[color]};
  ${fontSizes.LARGE};
  ${presets.ELLIPSIS};
  font-weight: bold;
  & > svg {
    color: ${colors.GRAY};
    ${fontSizes.SMALL};
    margin: 0 5px 0 0;
  }
`;

export const UnshippedQuantityStyle = css`
  position: relative;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.MEDIUM};
  ${presets.ELLIPSIS};
  font-weight: bold;
  & > svg {
    color: ${colors.GRAY_LIGHT};
    ${fontSizes.SMALL};
    margin: 0 5px 0 0;
  }
`;

export const SlashStyle = css`
  width: 2px;
  height: 16px;
  background-color: #fff;
  position: absolute;
  left: 6px;
  top: 1px;
  transform: rotate(-45deg);
`;

export const ChartButtonStyle = css`
  width: 72px;
  height: 72px;
`;

export const FooterStyle = css`
  ${layout.HORIZONTAL};
`;
