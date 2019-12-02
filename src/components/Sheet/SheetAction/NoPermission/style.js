// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const BodyWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 30px;
  justify-items: center;
  padding: 30px 30px 20px 30px;
`;

export default BodyWrapperStyle;
