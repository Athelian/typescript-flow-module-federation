// @flow
import { css } from 'react-emotion';

export const ButtonStyle = ({ width, height }: { width: string, height: string }) => css`
  width: ${width};
  height: ${height};
  position: absolute;
  top: 0;
  left: 0;
  border: 2px solid transparent;
  &:focus-within {
    border-color: blue;
  }
`;

export const InputStyle = ({ width, height }: { width: string, height: string }) => css`
  width: ${width};
  height: ${height};
  border: 2px solid transparent;
  &:focus {
    border-color: blue;
  }
`;
