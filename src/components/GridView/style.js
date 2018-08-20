// @flow
import { css } from 'react-emotion';
import { fontSizes, colors } from 'styles/common';

export const GridViewWrapperStyle = (itemWidth: number, spacing: number) => css`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, ${itemWidth}px);
  grid-auto-rows: min-content;
  grid-gap: ${spacing}px;
  padding: 50px 20px;
`;

export const EmptyMessageStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;
