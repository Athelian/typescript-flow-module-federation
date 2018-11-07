// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const MainContentWrapperStyle: string = css`
  width: 100%;
  ${layout.GRID_HORIZONTAL};
  grid-template-columns: 640px auto;
  overflow-y: hidden;
`;

export default MainContentWrapperStyle;
