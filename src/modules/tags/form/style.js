// @flow
import { css } from 'react-emotion';
import { layout, presets } from 'styles/common';

export const TagFormWrapperStyle = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const TagSectionWrapperStyle = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px;
`;
