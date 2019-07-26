// @flow
import { css } from 'react-emotion';
import {
  presets,
  colors,
  borderRadiuses,
  scrollbars,
  fontSizes,
  layout,
  shadows,
} from 'styles/common';

export const ProductSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 100px;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
`;

export const MainFieldsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;

export const ProductImagesWrapperStyle = (numOfFiles: number): string => css`
  position: relative;
  width: 100%;
  height: 220px;
  ${layout.GRID_HORIZONTAL};
  ${numOfFiles > 0 && numOfFiles < 4
    ? `
    padding: 20px 20px 20px 140px
  `
    : `
    padding: 20px
  `};
  ${numOfFiles < 4 && 'justify-content: center'};
  grid-gap: 20px;
  margin-bottom: 40px;
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  overflow: hidden;
  ${scrollbars.SMALL};
  &:hover {
    overflow-y: hidden;
    overflow-x: auto;
  }
`;

export const ProductImageWrapperStyle: string = css`
  position: relative;
  height: 180px;
  width: 180px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  ${borderRadiuses.MAIN};
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const ProductImageStyle: string = css`
  height: 180px;
  width: 180px;
  ${borderRadiuses.MAIN};
  object-fit: contain;
`;

export const ViewImageButtonStyle: string = css`
  position: absolute;
  top: 5px;
  right: 40px;
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  ${fontSizes.MAIN};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.2);
  color: ${colors.WHITE};
  opacity: 0;
  &:hover,
  :focus {
    background-color: ${colors.BLUE};
  }
`;

export const DeleteImageButtonStyle: string = css`
  position: absolute;
  top: 5px;
  right: 5px;
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  ${fontSizes.MAIN};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  background-color: rgba(0, 0, 0, 0.2);
  color: ${colors.WHITE};
  opacity: 0;
  &:hover,
  :focus {
    background-color: ${colors.RED};
  }
`;

export const SwapImageButtonStyle = (position: 'left' | 'right'): string => css`
  position: absolute;
  ${position}: -10px;
  top: 50%;
  transform: translateY(-50%);
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  ${fontSizes.MAIN};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  opacity: 0;
  color: ${colors.GRAY_LIGHT};
  background-color: ${colors.WHITE};
  ${shadows.DROPDOWN};
  &:hover,
  :focus {
    color: ${colors.BLUE};
    opacity: 1;
  }
`;

export const ScrollFixStyle: string = css`
  width: 1px;
`;

export const DividerStyle: string = css`
  margin: 40px 0;
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 100%;
`;
