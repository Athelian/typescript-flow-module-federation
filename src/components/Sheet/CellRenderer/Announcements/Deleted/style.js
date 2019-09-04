// @flow
import { css } from 'react-emotion';
import { colors, layout } from 'styles/common';

export const DeletedStyle = (height: number, width: number) => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  position: absolute;
  top: 0;
  left: 0;
  height: ${height}px;
  width: ${width}px;
  background-color: ${colors.RED};
  padding-left: 50px;
  z-index: 10;
  overflow: hidden;

  @keyframes appearing {
    0% {
      opacity: 0;
      width: 0;
    }
    5% {
      opacity: 1;
      width: ${width}px;
    }
  }

  animation: appearing 5s ease-out 1 forwards;
`;

export const LabelStyle = css`
  color: ${colors.WHITE};
`;
