// @flow
import { css } from 'react-emotion';

export const WrapperStyle = (columns: number) => css`
  display: flex;
  width: ${columns * 30 + 70}px;
`;

export default WrapperStyle;
