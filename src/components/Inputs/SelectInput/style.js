// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, scrollbars, shadows } from 'styles/common';

export const OptionsWrapperStyle = (width: number, height: number) => css`
  ${shadows.INPUT};
  ${borderRadiuses.MAIN};
  position: fixed;
  z-index: 100;
  background: ${colors.WHITE};
  height: ${height}px;
  width: ${width}px;
  margin-top: 5px;
  overflow: hidden;
  & > div {
    ${scrollbars.SMALL};
  }
`;

export default OptionsWrapperStyle;
