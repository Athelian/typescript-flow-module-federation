// @flow
import { css } from 'react-emotion';
import {
  colors,
  shadows,
  borderRadiuses,
  presets,
  fontSizes,
  scrollbars,
  transitions,
} from 'styles/common';

export const ItemsAreaWrapperStyle = (itemsIsExpanded: boolean): string => css`
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  display: grid;
  grid-template-rows: 50px 1fr 50px;
  width: ${itemsIsExpanded ? '645px' : '235px'};
  ${shadows.HEADER_RIGHT};
  z-index: 2;
  ${transitions.EXPAND};
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const ItemsNavbarWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  position: relative;
`;

export const ItemsBodyWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 65vh;
`;

export const ItemsHeaderWrapperStyle: string = css`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const ItemsTitleWrapperStyle: string = css`
  height: 50px;
  display: flex;
  align-items: center;
  ${fontSizes.LARGE};
  color: ${colors.GRAY_DARK};
`;

export const IconStyle: string = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const TitleStyle: string = css`
  ${presets.ELLIPSIS};
  font-weight: bold;
  letter-spacing: 2px;
`;

export const SyncButtonWrapperStyle: string = css`
  display: flex;
  align-items: flex-start;
  padding: 0 10px;
  height: 40px;
`;

export const NoItemsFoundStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

export const ItemsGridStyle: string = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  grid-auto-rows: min-content;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.SMALL};
  height: 100%;
  width: 100%;
`;

export const ItemCardFocusWrapperStyle: string = css`
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
  max-width: 235px;
  padding: 30px 0;
  height: min-content;
`;

export const ItemCardFocusBackgroundStyle = (isSelected: boolean): string => css`
  position: absolute;
  top: 0;
  left: 0;
  ${presets.BUTTON};
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  background-color: ${isSelected ? colors.GRAY_LIGHT : colors.GRAY_SUPER_LIGHT};
  &:hover {
    background-color: ${isSelected ? colors.GRAY : colors.GRAY_VERY_LIGHT};
    & > div {
      opacity: 1;
    }
  }
`;

export const EyeballIconStyle: string = css`
  position: absolute;
  top: 10px;
  left: 5px;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: 30px;
  height: 30px;
  color: ${colors.GRAY_LIGHT};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  opacity: 0;
  ${fontSizes.MAIN};
  z-index: 1;
`;

export const ItemsFooterWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding: 0 10px;
  position: relative;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER_REVERSE};
`;
