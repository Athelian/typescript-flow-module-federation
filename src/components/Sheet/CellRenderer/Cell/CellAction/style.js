// @flow
import { css } from 'react-emotion';
import { fontSizesWithHeights, layout } from 'styles/common';

export const CellActionWrapperStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  padding: 5px;
`;

export const ButtonStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  height: 20px;
`;
