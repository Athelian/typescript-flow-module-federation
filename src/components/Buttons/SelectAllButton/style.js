// @flow
import { css } from 'react-emotion';

export const SelectAllStyle = (right?: number): string => css`
  ${right
    ? `
    position: absolute;
    right: ${right}px;
  `
    : ''}
`;
