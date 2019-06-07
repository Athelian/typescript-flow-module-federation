// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const HorizontalLayoutWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  width: 100%;
  padding: 10px 0;
  grid-gap: 5px;
  padding: 10px 5px 10px 20px;
`;

export default HorizontalLayoutWrapperStyle;
