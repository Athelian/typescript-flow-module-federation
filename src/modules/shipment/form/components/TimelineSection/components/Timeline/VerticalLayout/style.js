// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const VerticalLayoutWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  flex: 1;
  padding: 10px;
`;

export default VerticalLayoutWrapperStyle;
