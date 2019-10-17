// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, scrollbars, shadows } from 'styles/common';

export const WrapperStyle = css`
  position: relative;
`;

export const OptionsWrapperStyle = (width: number, height: number) => css`
  ${shadows.INPUT};
  ${scrollbars.SMALL};
  ${borderRadiuses.MAIN};
  background: ${colors.WHITE};
  height: ${height}px;
  width: ${width}px;
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  z-index: 2;
  overflow: hidden;
`;
