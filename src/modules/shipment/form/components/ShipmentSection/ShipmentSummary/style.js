// @flow
import { css } from 'react-emotion';

import { layout } from 'styles/common';

export const SummaryStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 100px;
  grid-template-columns: repeat(2, 1fr);
`;

export default SummaryStyle;
