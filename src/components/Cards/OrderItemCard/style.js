// @flow
import { css } from 'react-emotion';
import { fontSizes } from 'styles/common';

export const OrderItemCardWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 195px;
  height: 200px;
  ${fontSizes.MAIN};
`;

export const QuantityWrapperStyle = css`
  display: grid;
  grid-template-columns: 90px 95px;
  width: 100%;
  padding: 0 5px;
`;

export const TotalPriceWrapperStyle = css`
  display: grid;
  grid-template-columns: 90px 90px;
  width: 100%;
  padding: 0 10px 0 5px;
`;
