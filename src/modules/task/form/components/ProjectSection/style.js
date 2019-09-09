// @flow
import { css } from 'react-emotion';
import { layout, presets } from 'styles/common';

export const ProjectSectionStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 10px;
  ${layout.GRID_HORIZONTAL};
  grid-template-columns: 640px 200px;
  grid-gap: 20px;
`;

export const ProjectSectionPlusButtonWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 10px;
`;

export const ProjectSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;
