// @flow
import { css } from 'react-emotion';
import { fontSizes } from 'styles/common';

export const DefaultStyleStyle = css`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: text;
  ${fontSizes.MAIN};
`;
