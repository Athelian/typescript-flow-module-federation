// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const SizeInputStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  height: 30px;
  overflow: hidden;
`;

export const SideStyle = css`
  min-width: 80px;
`;

export const SeparatorStyle = css`
  height: 20px;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0 5px;
  border: none;
  flex-shrink: 0;
`;
