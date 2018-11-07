// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const MainContentWrapperStyle: string = css`
  width: 100%;
  ${layout.GRID_HORIZONTAL};
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  overflow-y: hidden;
`;

export default MainContentWrapperStyle;
