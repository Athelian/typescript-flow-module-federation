// @flow
import { css } from 'react-emotion';

import { layout } from 'styles/common';

export const ModalStyle = css`
  padding: 20px;
`;

export const ConfirmMessageStyle = css`
  margin: 20px 0;
  text-align: center;
`;

export const ButtonsStyle = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: right;
  grid-gap: 10px;
`;
