// @flow
import { css } from 'react-emotion';
import { presets, colors, shadows, scrollbars, fontSizes, borderRadiuses } from 'styles/common';

export const AdvancedFilterWrapperStyle: string = css`
  position: relative;
`;

export const FilterToggleButtonStyle: string = css`
  position: relative;
  ${presets.BUTTON};
  color: ${colors.GRAY_LIGHT};
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  font-size: 18px;
  &:hover,
  :focus {
    color: ${colors.TEAL};
  }
`;

export const FilterToggleBadgeStyle: string = css`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background-color: ${colors.RED};
`;

type AdvancedFilterBodyWrapperType = {
  isOpen: boolean,
  isSideBarExpanded: boolean,
};

export const AdvancedFilterBodyWrapperStyle = ({
  isOpen,
  isSideBarExpanded,
}: AdvancedFilterBodyWrapperType): string => css`
  ${!isOpen && 'display: none'};
  position: fixed;
  left: ${isSideBarExpanded ? '200px' : '50px'};
  top: 100px;
  width: calc(100vw - ${isSideBarExpanded ? '200px' : '50px'});
  ${shadows.HEADER};
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const AdvancedFilterNavbarStyle: string = css`
  display: flex;
  align-items: center;
  ${shadows.HEADER};
  height: 50px;
  padding: 0 10px;
`;

export const AdvancedFilterBodyStyle: string = css`
  display: flex;
  height: 300px;
`;

export const EntityTypesWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 200px;
  overflow: hidden;
  ${scrollbars.SMALL};
  ${shadows.HEADER_RIGHT};
  &:hover {
    overflow-x: hidden;
    overflow-y: overlay;
  }
`;

export const EntityTypeIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EntityTypeStyle = (isActive: boolean): string => css`
  ${presets.BUTTON};
  display: grid;
  grid-template-columns: 40px 1fr 30px;
  grid-template-rows: 40px;
  align-items: center;
  height: 40px;
  flex-shrink: 0;
  padding: 0 10px 0 0;
  ${fontSizes.MAIN};
  ${isActive
    ? `
    background-color: ${colors.WHITE};
    color: ${colors.TEAL};
  `
    : `
    color: ${colors.GRAY_DARK};
    &:hover, :focus {
      background-color: ${colors.WHITE};
    }
  `};
`;

export const EntityTypeLabelStyle: string = css`
  ${presets.ELLIPSIS};
  letter-spacing: 2px;
`;

export const EntityTypeBadgeStyle = (isActive: boolean): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  color: ${colors.WHITE};
  background-color: ${isActive ? colors.TEAL : colors.GRAY_LIGHT};
  ${presets.ELLIPSIS};
  padding: 0 5px;
  ${fontSizes.SMALL};
`;

export const FilterFieldsWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  ${scrollbars.SMALL};
  ${shadows.HEADER_RIGHT};
  &:hover {
    overflow-x: hidden;
    overflow-y: overlay;
  }
`;

export const FilterInputWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  ${scrollbars.SMALL};
  ${shadows.HEADER_RIGHT};
  &:hover {
    overflow-x: hidden;
    overflow-y: overlay;
  }
`;
