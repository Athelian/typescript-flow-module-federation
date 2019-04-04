// @flow
import { css } from 'react-emotion';
import { scrollbars } from 'styles/common';

export const GridViewWrapperStyle: string = css`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 195px);
  grid-auto-rows: min-content;
  grid-column-gap: 20px;
  grid-row-gap: 30px;
  padding: 50px 20px;
  justify-content: center;
  ${scrollbars.MAIN};
  overflow-x: hidden;
  overflow-y: overlay;
`;

export default GridViewWrapperStyle;
