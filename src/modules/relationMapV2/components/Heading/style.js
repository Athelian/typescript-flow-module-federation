// @flow
import { css } from 'react-emotion';
import { borderRadiuses, fontSizes, colors, presets } from 'styles/common';

export const HeadingWrapperStyle = (isExpanded: boolean, width: string): string => css`
  ${presets.BUTTON};
  position: relative;
  display: flex;
  justify-content: space-between;
  width: ${width};
  height: 55px;
  ${borderRadiuses.MAIN};
  cursor: pointer;
  z-index: 2;
  ${isExpanded
    ? `
    background-color: rgba(0, 0, 0, 0.08);
    & span {
      top: 5px;
      opacity: 1;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
      & span {
        top: 0;
        opacity: 0;
      }
    }
  `
    : `
    background-color: rgba(0, 0, 0, 0.05);
    & span {
      top: 0;
      opacity: 0;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
      transform: translateY(2px);
      & span {
        top: 5px;
        opacity: 1;
      }
    }
  `};
`;

export const LeftWrapperStyle: string = css`
  display: grid;
  grid-template-rows: 20px 20px;
  grid-gap: 5px;
  padding: 5px;
  grid-template-columns: 140px;
`;

export const TotalWrapperStyle: string = css`
  display: flex;
`;

export const SelectAllButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  ${borderRadiuses.MAIN};
  height: 20px;
  line-height: 20px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${colors.WHITE};
  background-color: rgba(0, 0, 0, 0.05);
  justify-content: space-between;
  padding: 0 5px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const ExpandedIconWrapperStyle = (isExpanded: boolean): string => css`
  ${presets.BUTTON};
  position: absolute;
  top: 0;
  right: 0;
  ${isExpanded && 'transform: rotate(180deg)'};
  color: rgba(0, 0, 0, 0.1);
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
