// @flow
import { css } from 'react-emotion';
import { presets, colors, shadows, scrollbars, fontSizes, borderRadiuses } from 'styles/common';

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
