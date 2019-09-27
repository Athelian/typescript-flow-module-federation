// @flow
import { css } from 'react-emotion';
import { borderRadiuses, fontSizes, colors, presets, shadows } from 'styles/common';

export const ItemHeadingWrapperStyle = (isExpanded: boolean): string => css`
  ${presets.BUTTON};
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 465px;
  height: 55px;
  ${borderRadiuses.MAIN};
  cursor: pointer;
  ${isExpanded
    ? `
    background-color: rgba(0, 0, 0, 0.05);
    & span {
      top: 5px;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
      & span {
        top: 0;
      }
    }
  `
    : `
    background-color: ${colors.WHITE};
    ${shadows.WATERFALL};
    &:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      & span {
        top: 5px;
      }
    }
  `};
`;

export const LeftWrapperStyle: string = css`
  display: grid;
  grid-template-rows: 20px 20px;
  grid-gap: 5px;
  padding: 5px;
`;

export const TotalWrapperStyle: string = css`
  display: flex;
`;

export const SelectAllButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 125px;
  height: 20px;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0 5px 0 0;
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const RightWrapperStyle: string = css`
  position: relative;
  display: grid;
  grid-template-rows: 20px 20px;
  padding: 10px 25px 5px 0;
  width: 175px;
`;

export const QuantityIconsWrapperStyle: string = css`
  display: flex;
  justify-content: space-between;
  ${fontSizes.SMALL};
  color: rgba(0, 0, 0, 0.1);
  padding: 0 0 10px 0;
  align-items: center;
`;

export const QuantityLabelStyle: string = css`
  position: absolute;
  right: calc(100% + 5px);
  bottom: 9px;
`;

export const ExpandedIconWrapperStyle = (isExpanded: boolean): string => css`
  ${presets.BUTTON};
  position: absolute;
  top: 0;
  right: 0;
  ${isExpanded && 'transform: rotate(180deg)'};
  color: ${isExpanded ? colors.GRAY_LIGHT : colors.GRAY_VERY_LIGHT};
  ${fontSizes.SMALL};
  width: 20px;
  height: 20px;
`;

export const ItemHeadingFilteredStyle = (showBlueBorder: boolean): string => css`
  position: absolute;
  top: -4px;
  left: -4px;
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  border: 4px solid ${showBlueBorder ? colors.BLUE_HALF : colors.TRANSPARENT};
  border-radius: 9px;
  pointer-events: none;
`;

export const ItemHeadingSelectedStyle = (showTealBorder: boolean): string => css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid ${showTealBorder ? colors.TEAL_HALF : colors.TRANSPARENT};
  ${borderRadiuses.MAIN};
  pointer-events: none;
`;
