// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, borderRadiuses, layout, presets } from 'styles/common';

export const TableHeaderWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  width: 100%;
`;

export const TableHeaderTitleStyle = (entity: string): string => css`
  ${presets.ELLIPSIS};
  font-weight: bold;
  ${fontSizesWithHeights.SMALL};
  color: ${colors[entity]};
  letter-spacing: 2px;
  padding: 0 0 0 5px;
`;

export const TableHeaderGroupStyle: string = css`
  display: flex;
  width: 100%;
`;

export const TableColumnHeaderStyle = (entity: string): string => css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  width: 200px;
  height: 26px;
  background-color: ${colors[entity]};
  ${borderRadiuses.MAIN};
  margin: 0 5px;
  align-items: center;
  padding: 0 0 0 3px;
`;

export const TableColumnStyle: string = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.SMALL};
  color: ${colors.WHITE};
  letter-spacing: 2px;
  margin: 0 0 0 5px;
  text-transform: uppercase;
`;
