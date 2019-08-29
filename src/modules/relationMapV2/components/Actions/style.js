// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const ActionsWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

export default ActionsWrapperStyle;
