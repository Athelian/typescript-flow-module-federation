// @flow
import { css } from 'react-emotion';
import { transitions } from 'styles/common';

export const ResetNativeStyle = css`
  position: relative;
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-top: 4px;
    overflow: hidden;
    width: 100%;
    li {
      min-width: min-content;
      width: 100%;
    }
  }
`;

export const ArrowDownStyle = (isOpen: boolean) => css`
  ${transitions.EXPAND};
  transform: rotate(${isOpen ? '180' : '0'}deg);
`;
