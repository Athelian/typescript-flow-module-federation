// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets, borderRadiuses } from 'styles/common';

export const DisplayWrapperStyle = (align: 'left' | 'right' | 'center') => css`
  ${fontSizesWithHeights.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  ${borderRadiuses.MAIN};
  text-align: ${align};
  width: 100%;
`;

export default DisplayWrapperStyle;
