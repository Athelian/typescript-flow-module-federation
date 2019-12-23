// @flow
import { css } from 'react-emotion';

export const InnerColumnsWrapperStyle: string = css`
  display: grid;
  grid-auto-rows: 30px;
  grid-template-columns: 1fr;
  grid-gap: 10px;
`;

export const InnerColumnStyle: string = css`
  display: grid;
  grid-template-columns: 25px 1fr;
  align-items: center;
`;
