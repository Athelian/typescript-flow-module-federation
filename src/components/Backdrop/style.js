// @flow
import { css } from 'react-emotion';

export const WrapperStyle = css`
  position: relative;
`;

export const ChildrenWrapperStyle = (active: boolean) => css`
  position: sticky;
  ${active && `z-index: 10000`};
`;

export const BackdropStyle = css`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  cursor: default;
`;
