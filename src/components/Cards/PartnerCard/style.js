// @flow
import { css } from 'react-emotion';
import {
  colors,
  fontSizesWithHeights,
  presets,
  borderRadiuses,
  fontSizes,
  layout,
} from 'styles/common';

export const PartnerCardStyle = (size: 'full' | 'half' | 'quarter'): string => css`
  display: grid;
  ${size === 'full' &&
    `
      grid-template-columns: 195px;
      grid-template-rows: 135px 80px;
    `};
  ${size === 'half' &&
    `
      grid-template-columns: 195px;
      grid-template-rows: 30px 80px;
    `};
  ${size === 'quarter' &&
    `
      grid-template-columns: 92.5px;
      grid-template-rows: 30px 80px;
    `};
`;

export const PartnerCardImageStyle: string = css`
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PartnerInfoWrapperStyle = (size: 'full' | 'half' | 'quarter'): string => css`
  ${layout.GRID_VERTICAL};
  grid-template-columns: ${size === 'quarter' ? '92.5px' : '195px'};
  grid-gap: 5px;
  padding: 5px 0;
  width: ${size === 'quarter' ? '92.5px' : '195px'};
`;

export const PartnerNameStyle: string = css`
  color: ${colors.BLACK};
  font-weight: bold;
  ${fontSizesWithHeights.MAIN};
  ${presets.ELLIPSIS};
  width: 100%;
  padding: 0 10px;
`;

export const PartnerTypesWrapperStyle = (size: 'full' | 'half' | 'quarter'): string => css`
  ${size === 'quarter'
    ? `
    display: grid;
    grid-template-columns: 20px 20px 20px;
    grid-template-rows: 20px 20px;
    grid-row-gap: 5px;
  `
    : `
   ${layout.GRID_HORIZONTAL}
  `};
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
`;

export const PartnerTypeStyle = (isActive: boolean) => css`
  ${borderRadiuses.CIRCLE};
  ${presets.BUTTON};
  cursor: default;
  background-color: ${isActive ? colors.TEAL : colors.GRAY_LIGHT};
  color: ${colors.WHITE};
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  ${fontSizes.SMALL};
`;
