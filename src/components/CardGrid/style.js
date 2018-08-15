// @flow
import { css } from 'react-emotion';

export const WrapperStyle = css`
  overflow: hidden;
  height: 100%;
`;

export const RowStyle = (itemSize: number, padding: number) => css`
  display: grid;
  grid-template-columns: repeat(auto-fit, ${itemSize}px);
  grid-gap: ${padding}px;
`;
