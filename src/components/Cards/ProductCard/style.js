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

export const ProductCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 227px;
  &:hover {
    button {
      opacity: 1;
    }
  }
`;

export const ProductImageWrapperStyle: string = css`
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

export const ProductImageChevronButtonStyle = (
  position: 'left' | 'right',
  disabled: boolean
): string => css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${position}: 5px;
  ${presets.BUTTON};
  color: ${disabled ? 'rgba(0, 0, 0, 0.2)' : colors.WHITE};
  font-size: 30px;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.1);
  ${borderRadiuses.MAIN};
  opacity: 0;
  ${!disabled &&
    `
    &:hover,
    :focus {
      color: ${colors.TEAL};
      background-color: rgba(0, 0, 0, 0.2);
    }
  `};
`;

export const ProductImageDotsWrapperStyle: string = css`
  position: absolute;
  bottom: 3px;
  left: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, 5px);
  grid-template-rows: 1fr;
  grid-gap: 5px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const ProductImageDotStyle = (isActive: boolean): string => css`
  width: 5px;
  height: 5px;
  flex-shrink: 0;
  background-color: ${isActive ? colors.WHITE : 'rgba(255, 255, 255, 0.5)'};
  ${borderRadiuses.CIRCLE};
  box-shadow: 0 0 7px 3px rgba(0, 0, 0, 0.2);
`;

export const ProductInfoWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 185px;
  grid-gap: 5px;
  padding: 5px;
  width: 195px;
`;

export const ProductNameStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  ${presets.ELLIPSIS};
  padding: 0 5px;
  width: 100%;
`;

export const ProductSerialStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  padding: 0 5px;
  width: 100%;
`;

export const ProductProvidersWrapperStyle: string = css`
  position: relative;
  display: grid;
  grid-template-columns: 185px;
  grid-gap: 5px;
  width: 185px;
`;

export const ProductExporterStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  padding: 0 5px;
  width: 100%;
  & > svg {
    margin: 0 5px 0 0;
    color: ${colors.GRAY_DARK};
  }
`;

export const ProductSupplierStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  padding: 0 5px;
  width: 100%;
  & > svg {
    margin: 0 5px 0 0;
    color: ${colors.GRAY_DARK};
  }
`;

export const MoreProviderBadge: string = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
  padding: 0 5px;
  ${borderRadiuses.BUTTON};
`;

export const TagsAndTaskWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 155px 20px;
  grid-gap: 5px;
  align-items: center;
  padding: 5px 0 0 0;
`;

export const ProductTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  overflow: hidden;
  width: 155px;
  padding: 0 0 0 5px;
`;
