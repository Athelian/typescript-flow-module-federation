// @flow
import { css } from 'react-emotion';
import { presets, layout } from 'styles/common';

export const ProjectInfoSectionWrapperStyle = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;

export const DescriptionAndTagsWrapperStyle = css`
  display: flex;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  padding: 0 0 0 20px;
`;
