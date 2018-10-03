// @flow
import { css } from 'react-emotion';
import { scrollbars, transitions, colors } from 'styles/common';

export const LogsBodyWrapperStyle: string = css`
  height: calc(100vh - 100px);
  width: 100%;
  min-width: min-content;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.MAIN};
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 95px;
  ${transitions.EXPAND};
  background-color: ${colors.WHITE};
`;

export const CommentWrapperStyle: string = css`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
`;
