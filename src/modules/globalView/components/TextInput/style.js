// @flow
import { css } from 'react-emotion';

export const ButtonStyle = ({
  width,
  height,
  topBorder,
  rightBorder,
  bottomBorder,
  leftBorder,
}: {
  width: string,
  height: string,
  topBorder: boolean,
  rightBorder: boolean,
  bottomBorder: boolean,
  leftBorder: boolean,
}) => css`
  width: ${width};
  height: ${height};
  position: absolute;
  top: 0;
  left: 0;
  border: 2px solid transparent;
  &:focus-within {
    border-color: blue;
    ${topBorder && 'border-top-color: blue;'}
    ${rightBorder && 'border-right-color: blue;'}
    ${bottomBorder && 'border-bottom-color: blue;'}
    ${leftBorder && 'border-left-color: blue;'}
  }
`;

export const InputStyle = ({ width, height }: { width: string, height: string }) => css`
  width: ${width};
  height: ${height};
  border: 2px solid transparent;
`;
