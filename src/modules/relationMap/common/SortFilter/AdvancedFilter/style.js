// @flow
import { css } from 'react-emotion';
import { presets, colors, shadows, borderRadiuses } from 'styles/common';

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
  top: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  background-color: ${colors.RED};
  ${borderRadiuses.CIRCLE};
  flex-shrink: 0;
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
  position: relative;
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  border-bottom: 1px solid ${colors.GRAY_VERY_LIGHT};
`;

export const AdvancedFilterBodyStyle: string = css`
  display: flex;
  height: 300px;
`;
