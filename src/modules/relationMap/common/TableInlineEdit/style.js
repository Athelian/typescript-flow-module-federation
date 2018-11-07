// @flow
import { css } from 'react-emotion';

export const WrapperStyle: string = css`
  width: 100%;
  display: flex;
`;

export const TableHeaderStyle = (totalColumns: number) => css`
  width: ${120 * totalColumns}px;
`;
