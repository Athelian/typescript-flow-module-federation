// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, scrollbars, fontSizes, layout } from 'styles/common';

export const ProductSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 0 0 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProductImagesWrapperStyle = (isOverflow: boolean): string => css`
  position: relative;
  width: 100%;
  height: 220px;
  padding: 20px;
  ${layout.GRID_HORIZONTAL};
  ${!isOverflow && 'justify-content: center'};
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
  object-fit: cover;
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
    color: ${colors.BLUE};
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
  ${position}: -15px;
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
  &:hover,
  :focus {
    color: ${colors.BLUE};
    opacity: 1;
  }
`;

export const ScrollFixStyle: string = css`
  width: 1px;
`;

export const TagsInputStyle: string = css`
  margin-top: 20px;
`;

export const DividerStyle: string = css`
  margin: 40px 0;
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 100%;
`;
