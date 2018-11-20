// @flow
import { css } from 'react-emotion';
import { presets, colors, scrollbars, fontSizes, borderRadiuses } from 'styles/common';

export const EntityTypesWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 200px;
  overflow: hidden;
  ${scrollbars.SMALL};
  &:hover {
    overflow-x: hidden;
    overflow-y: overlay;
  }
`;

export const EntityTypeIconStyle = (isActive: boolean): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${isActive ? colors.TEAL : colors.GRAY_LIGHT};
`;

export const EntityTypeMenuItemStyle = (isActive: boolean): string => css`
  ${presets.BUTTON};
  flex-shrink: 0;
  width: 100%;
  ${fontSizes.MAIN};
  ${isActive
    ? `
  background-color: ${colors.WHITE};
`
    : `
  &:hover, :focus {
    background-color: ${colors.WHITE};
  }
`};
`;

export const EntityTypeLayoutStyle: string = css`
  display: grid;
  grid-template-columns: 40px 1fr 30px;
  grid-template-rows: 40px;
  align-items: center;
  height: 40px;
  width: 100%;
  padding: 0 10px 0 0;
`;

export const EntityTypeLabelStyle = (isActive: boolean): string => css`
  ${presets.ELLIPSIS};
  letter-spacing: 2px;
  color: ${isActive ? colors.TEAL : colors.GRAY_DARK};
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
