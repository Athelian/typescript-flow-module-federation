// @flow
import { css } from 'react-emotion';
import { scrollbars } from 'styles/common';

export const OrderListWrapperStyle: string = css`
  grid-column: span 3;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.MAIN};
  min-height: 0;
  display: grid;
  grid-template-columns: 300px 20px 300px 20px 300px;
  padding: 20px 20px 100px 20px;
`;

export const ShipmentListWrapperStyle: string = css`
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.MAIN};
  min-height: 0;
  padding: 20px 20px 100px 20px;
`;
