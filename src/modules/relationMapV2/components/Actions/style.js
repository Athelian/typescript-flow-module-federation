// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const ActionsWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  position: absolute;
  bottom: 30px;
  right: 20px;
`;

export const LeftActionsWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  position: absolute;
  bottom: 30px;
  left: 20px;
`;
