// @flow
import { css } from 'react-emotion';

export const GridViewWrapperStyle = css`
  padding: 50px 20px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  grid-auto-rows: min-content;
  grid-gap: 20px;
  justify-content: center;
`;

export default GridViewWrapperStyle;