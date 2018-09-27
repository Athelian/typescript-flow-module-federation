// @flow
import { css } from 'react-emotion';
import { layout, presets } from 'styles/common';

export const FormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;
export const SectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px;
`;
