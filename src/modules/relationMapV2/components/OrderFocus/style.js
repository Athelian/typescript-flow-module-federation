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

export const MatchedStyle = css`
  position: absolute;
  left: -4px;
  top: -4px;
  height: calc(100% + 8px);
  width: calc(100% + 8px);
  border-radius: 9px;
  background: rgba(11, 110, 222, 0.5);
  z-index: -1;
`;
