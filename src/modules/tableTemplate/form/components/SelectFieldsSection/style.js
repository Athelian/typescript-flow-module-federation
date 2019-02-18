// @flow
import { css } from 'react-emotion';
import { layout, presets } from 'styles/common';

export const ContentWrapperStyle: string = css`
  ${presets.BOX};
  ${layout.GRID_HORIZONTAL};
  width: 880px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  overflow-y: hidden;
  padding: 40px;
`;

export default ContentWrapperStyle;
