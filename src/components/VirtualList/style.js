// @flow
import { css } from 'react-emotion';
import { layout, scrollbars } from 'styles/common';

export const VirtualListStyle = css`
  ${scrollbars.MAIN};
  overflow-x: hidden !important;
  overflow-y: overlay !important;
  & > div {
    overflow: visible !important;
  }
`;

export const LoadingContentStyle = css`
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  height: 100%;
`;
