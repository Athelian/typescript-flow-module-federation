// @flow
import { css } from 'react-emotion';
import { colors, layout, presets } from 'styles/common';

export const ProjectSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const ProjectSectionStyle: string = css`
  width: 880px;
  padding: 30px 10px;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 20px;
`;
