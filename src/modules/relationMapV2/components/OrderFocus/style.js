// @flow
import { css } from 'react-emotion';
import { scrollbars } from 'styles/common';

export const WrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  ${scrollbars.MAIN};
`;

export const ContentStyle = css`
  margin: 10px 0;
  min-width: 10px;
`;

export const ListStyle = css`
  ${scrollbars.MAIN};
`;

export const RowStyle = css`
  display: grid;
  grid-template-columns: repeat(5, min-content);
`;
