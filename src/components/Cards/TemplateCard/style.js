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

export const TemplateCardWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-template-columns: 195px;
  grid-gap: 5px;
  padding: 5px 0;
  height: 125px;
`;

export const TemplateNameStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  ${presets.ELLIPSIS};
  padding: 0 10px;
  width: 100%;
`;

export const TemplateDescriptionStyle: string = css`
  position: relative;
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  padding: 0 10px;
  height: 60px;
  line-height: 20px;
  overflow: hidden;
`;

export const TemplateDescriptionFadeStyle: string = css`
  position: absolute;
  width: 100%;
  height: 20px;
  bottom: 0;
  left: 0;
  background: linear-gradient(to bottom, ${colors.TRANSPARENT}, ${colors.WHITE});
`;

export const TemplateCountWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: min-content;
  padding: 0 5px;
  margin: 0 10px;
`;

export const TemplateCountIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  ${fontSizes.SMALL};
  color: ${colors.GRAY};
`;

export const TemplateCountStyle: string = css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  ${presets.ELLIPSIS};
  line-height: 20px;
  padding: 0 5px;
`;
