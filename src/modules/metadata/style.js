// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const MainContentWrapperStyle: string = css`
  width: 100%;
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;

export default MainContentWrapperStyle;
