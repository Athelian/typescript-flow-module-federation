// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const OverflowStyle: string = css`
  padding-left: 5px;
  color: ${colors.GRAY_DARK};
`;

export const TagContainerStyle: string = css`
  > div {
    margin-left: 2px;
    margin-right: 2px;
  }
`;

export const MessageContainerStyle: string = css`
  > div {
    padding-bottom: 4px;
  }
`;
