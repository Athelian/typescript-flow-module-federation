// @flow
import { css } from 'react-emotion';
import {
  colors,
  layout,
  fontSizes,
  fontSizesWithHeights,
  presets,
  borderRadiuses,
} from 'styles/common';

export const TableTemplateCardWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-template-columns: 195px;
  grid-gap: 10px;
  padding: 10px 0;
`;

export const TableTemplateNameStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  ${presets.ELLIPSIS};
  padding: 0 10px;
  width: 100%;
`;

export const TableTemplateDescriptionStyle: string = css`
  position: relative;
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  padding: 0 10px;
  height: 60px;
  line-height: 20px;
  overflow: hidden;
`;

export const TableTemplateCustomFieldsLengthStyle: string = css`
  position: relative;
  ${fontSizes.MAIN};
  background-color: ${colors.GRAY};
  color: ${colors.BLACK};
  margin: 0 10px;
  padding: 0 10px;
  width: 60px;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  ${borderRadiuses.BUTTON};
`;
