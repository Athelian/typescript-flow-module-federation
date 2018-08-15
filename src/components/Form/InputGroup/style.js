// @flow
import { css } from 'react-emotion';

export const FieldStyle = css`
  margin: 8px;
`;

export const WrapperStyle = (direction: 'column' | 'row') => css`
  display: flex;
  flex-direction: ${direction};
  margin: 16px 0;
`;
