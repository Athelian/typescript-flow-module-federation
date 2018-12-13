// @flow
import { css } from 'react-emotion';
import { scrollbars, colors } from 'styles/common';

export const OrderListWrapperStyle: string = css`
  grid-column: span 3;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.MAIN};
  min-height: 0;
  display: grid;
  grid-template-columns: 300px 20px 300px 20px 300px;
  background-color: ${colors.WHITE};
`;

export const ShipmentListWrapperStyle: string = css`
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.MAIN};
  min-height: 0;
`;
