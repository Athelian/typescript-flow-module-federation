// @flow
import { css } from 'react-emotion';

export const InputWrapperStyle = (direction: 'column' | 'row', gap: number) => css`
  display: grid;
  grid-auto-flow: ${direction};
  ${direction === 'row' ? '  grid-auto-rows: min-content' : 'grid-auto-column: min-content'};
  grid-gap: ${gap}px;
`;

export default InputWrapperStyle;
