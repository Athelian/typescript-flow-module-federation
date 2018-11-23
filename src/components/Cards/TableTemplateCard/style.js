// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, layout, fontSizes } from 'styles/common';

export const TableTemplateCardWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-template-columns: 195px;
  grid-gap: 5px;
  padding: 5px 0;
`;

export const TableTemplateWrapperStyle: string = css`
  display: flex;
  align-items: center;
  width: 175px;
  margin: 0 10px;
`;

export const TableTemplateDescriptionWrapperStyle: string = css`
  position: relative;
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  padding: 0 10px;
  height: 60px;
  line-height: 20px;
  overflow: hidden;
`;

export const TableTemplateDescriptionFadeStyle: string = css`
  position: absolute;
  width: 100%;
  height: 20px;
  bottom: 0;
  left: 0;
  background: linear-gradient(to bottom, ${colors.TRANSPARENT}, ${colors.WHITE});
`;

export const TableTemplateTypesWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  width: 100%;
  padding: 0 10px;
  justify-content: space-between;
`;

export const TableTemplateTypeStyle = (color: string) => css`
  ${borderRadiuses.MAIN};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors[color]};
  color: ${colors.WHITE};
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  font-size: 11px;
`;
