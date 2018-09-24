// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const VerticalLayoutWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};

  height: 100%;
  padding: 10px;
`;

export default VerticalLayoutWrapperStyle;
