// @flow
import { css } from 'react-emotion';
import { presets, layout } from 'styles/common';

export const MetadataSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 100px;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
`;

export default MetadataSectionWrapperStyle;
