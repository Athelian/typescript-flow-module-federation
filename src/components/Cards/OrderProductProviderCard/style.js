// @flow
import { css } from 'react-emotion';
import { fontSizesWithHeights, layout, colors, presets, borderRadiuses } from 'styles/common';

export const ProductProviderCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 197px;
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

export const ProductImageChevronButtonStyle = (position: 'left' | 'right'): string => css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${position}: 5px;
  ${presets.BUTTON};
  color: ${colors.WHITE};
  font-size: 30px;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.1);
  ${borderRadiuses.MAIN};
  opacity: 0;
  &:hover,
  :focus {
    color: ${colors.TEAL};
    background-color: rgba(0, 0, 0, 0.2);
  }
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
  background-color: ${isActive ? colors.TEAL : colors.WHITE};
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

export const ProductTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  width: 175px;
  margin: 0 5px;
  overflow: hidden;
`;
