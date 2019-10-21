// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, scrollbars, shadows } from 'styles/common';

export const OptionsWrapperStyle = (width: number, height: number) => css`
  ${shadows.INPUT};
  ${scrollbars.SMALL};
  ${borderRadiuses.MAIN};
  position: fixed;
  z-index: 100;
  background: ${colors.WHITE};
  height: ${height}px;
  width: ${width}px;
  margin-top: 5px;
  overflow: hidden;
`;
