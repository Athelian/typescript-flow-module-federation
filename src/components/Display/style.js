// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets } from 'styles/common';

export const ValueStyle = (ellipsis: boolean) => css`
  ${fontSizesWithHeights.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  ${ellipsis && presets.ELLIPSIS};
`;

export default ValueStyle;
