// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const OrderListWrapperStyle = (itemWidth: number, spacing: number) => css`
  display: grid;
  grid-template-columns: ${itemWidth}px auto ${itemWidth}px auto ${itemWidth}px;
  grid-auto-rows: min-content;
  grid-column-gap: ${spacing}px;
  grid-row-gap: 20px;
  padding: 50px 20px;
`;

export const EmptyMessageStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;
