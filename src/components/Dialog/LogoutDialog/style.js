// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const DialogStyle: string = css`
  padding: 24px;
`;

export const ConfirmMessageStyle: string = css`
  font-weight: bold;
  font-size: 14px;
  color: #555;
  margin: 24px 0;
  text-align: center;
`;

export const ButtonsStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  padding: 20px 0 0 0;
  justify-content: center;
  grid-gap: 10px;
`;
