// @flow
import { css } from 'react-emotion';

export const GridViewWrapperStyle = (itemWidth: number, spacing: number) => css`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, ${itemWidth}px);
  grid-auto-rows: min-content;
  grid-gap: ${spacing}px;
  justify-content: center;
`;

export default GridViewWrapperStyle;
