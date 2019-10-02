// @flow
import { css } from 'react-emotion';
import { layout, fontSizes, colors } from 'styles/common';

export const DialogStyle: string = css`
  padding: 20px;
`;

export const ConfirmMessageStyle: string = css`
  margin: 20px 0;
  text-align: center;
  font-weight: bold;
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
`;

export const ButtonsStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  padding: 20px 0 0 0;
  justify-content: center;
  grid-gap: 10px;
`;
