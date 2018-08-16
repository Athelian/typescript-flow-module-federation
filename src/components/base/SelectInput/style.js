// @flow
import { css } from 'react-emotion';
import { transitions } from 'styles/common';

export const ResetNativeStyle = css`
  position: relative;
  width: 100%;
  ul {
    list-style-type: none;
    position: fixed;
    margin: 0;
    padding: 0;
    margin-top: 4px;
    overflow: hidden;
    z-index: 1;
    min-width: min-content;
    li {
      min-width: min-content;
      width: 100%;
      white-space: nowrap;
    }
  }
`;

export const ArrowDownStyle = (isOpen: boolean) => css`
  ${transitions.EXPAND};
  transform: rotate(${isOpen ? '180' : '0'}deg);
`;
