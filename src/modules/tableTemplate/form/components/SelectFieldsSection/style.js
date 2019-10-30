// @flow
import { css } from 'react-emotion';
import { layout, presets } from 'styles/common';

export const ContentWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
`;

export const BlockStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-template-columns: 1fr 1fr 1fr 1fr;
  overflow-y: hidden;
  padding: 40px;
`;
