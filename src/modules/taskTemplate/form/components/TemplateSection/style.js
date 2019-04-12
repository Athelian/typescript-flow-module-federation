// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, borderRadiuses } from 'styles/common';

export const TableTemplateSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;

export const EntityTypesWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 200px 200px;
  grid-auto-rows: min-content;
  grid-row-gap: 10px;
  min-width: 400px;
  padding: 5px;
`;

export const EntityTypeStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  align-items: center;
`;

export const EntityIconStyle = (color: string) => css`
  ${borderRadiuses.MAIN};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors[color]};
  color: ${colors.WHITE};
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  font-size: 11px;
`;
