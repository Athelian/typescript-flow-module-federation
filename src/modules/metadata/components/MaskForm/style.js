// @flow
import { css } from 'react-emotion';
import { layout, presets } from 'styles/common';

export const TemplateFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const TemplateSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 240px;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
`;

export const DescriptionLabelWrapperStyle: string = css`
  height: 90px;
`;

export const TemplateFieldsSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 235px;
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;
