// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors } from 'styles/common';

export const GrayCardStyle = ({ width, height }: { width: string, height: string }): string => css`
  width: ${width};
  height: ${height};
  ${borderRadiuses.MAIN};
  background-color: ${colors.GRAY_VERY_LIGHT};
`;

export default GrayCardStyle;
