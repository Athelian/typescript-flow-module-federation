// @flow
import { css } from 'react-emotion';
import { layout, scrollbars } from 'styles/common';

export const WrapperStyle = css`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 24px;
`;

export const ContentWrapperStyle = css`
  height: calc(100vh - 50px);
  width: 100%;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.MAIN};
  margin-top: 50px;
`;

export const ContentStyle = (loading: boolean) =>
  css`
    display: flex;
    flex-direction: column;
    padding: 100px;
    height: min-content;
    min-height: 100vh;
    ${loading && layout.CENTER_CENTER};
  `;
