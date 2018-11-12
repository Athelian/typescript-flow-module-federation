// @flow
import { css } from 'react-emotion';

export const TableHeaderStyle = (totalColumns: number) => css`
  width: ${120 * totalColumns}px;
  min-width: ${120 * totalColumns}px;
`;

export const HorizonScrollStyle = css`
  overflow: auto;
  width: 1033px;
  height: 100%;
`;
