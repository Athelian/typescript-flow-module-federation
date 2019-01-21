// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, scrollbars, fontSizes, layout } from 'styles/common';

export const ItemsSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  padding: 50px 0 0 0;
  height: min-content;
`;

export const ItemsSectionBodyStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

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
  flex: 1;
  min-width: 640px;
  min-height: min-content;
  margin-left: 10px;
  background: ${colors.GRAY_VERY_LIGHT};
  ${borderRadiuses.MAIN};
  display: flex;
  flex-flow: column wrap;
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
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0 0 0;
`;

export const BatchStyle: string = css`
  display: flex;
  margin: 15px 10px;
`;

export const EmptyMessageStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: center;
  padding: 100px;
`;
