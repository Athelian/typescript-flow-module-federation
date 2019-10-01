// @flow
import { css } from 'react-emotion';
import { scrollbars } from 'styles/common';

export const WrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
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
  padding: 0 0 75px 0;
  width: 100%;
  height: 100%;
`;

export const RowStyle = css`
  display: grid;
  grid-template-columns: repeat(5, min-content);
`;

export const ActionsBackdropStyle: string = css`
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 20px;
  right: 20px;
  height: 80px;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), #eee);
  pointer-events: none;
`;

export const NoOrdersFoundStyle: string = css`
  height: calc(100vh - 100px);
  padding: 20px;
`;
