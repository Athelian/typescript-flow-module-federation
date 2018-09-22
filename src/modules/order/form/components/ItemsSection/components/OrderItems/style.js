// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, fontSizes, layout } from 'styles/common';

export const ItemGridStyle: string = css`
  display: flex;
  flex-wrap: wrap;
  padding: 15px 0 15px 10px;
`;

export const ItemStyle: string = css`
  display: flex;
  margin: 15px 10px;
`;

export const BatchAreaStyle: string = css`
  display: flex;
  flex-direction: column;
  min-width: 640px;
  min-height: min-content;
  margin-left: 10px;
  background: ${colors.GRAY_VERY_LIGHT};
  ${borderRadiuses.MAIN};
`;

export const BatchAreaHeaderStyle: string = css`
  grid-template-columns: 1fr;
  ${layout.GRID_HORIZONTAL};
  grid-template-rows: 40px;
  grid-gap: 40px;
  align-items: center;
  padding: 0 10px 0 0;
`;

export const TitleWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${fontSizes.LARGE};
  color: ${colors.GRAY_DARK};
`;

export const TitleStyle: string = css`
  ${presets.ELLIPSIS};
  font-weight: bold;
  letter-spacing: 2px;
`;

export const IconStyle: string = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const BatchGridStyle: string = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, 195px);
  grid-auto-rows: min-content;
  column-gap: 15px;
  row-gap: 30px;
  padding: 10px;
  height: min-content;
`;

export const EmptyMessageStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: center;
  padding: 100px;
`;
