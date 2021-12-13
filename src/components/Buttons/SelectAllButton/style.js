// @flow
import { css } from 'react-emotion';

export const SelectAllStyle: string = (right: number) => css`
  ${right
    ? `
    position: absolute;
    right: ${right}px;
  `
    : ''}
`;
