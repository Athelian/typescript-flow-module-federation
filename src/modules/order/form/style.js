// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const OrderFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const ToolBarStyle: string = css`
  position: absolute;
  top: 0;
  right: 0;
`;
