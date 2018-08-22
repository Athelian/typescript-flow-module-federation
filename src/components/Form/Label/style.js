// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizesWithHeights, fontSizes } from 'styles/common';

export const LabelWrapperStyle = css`
  width: 100%;
  ${fontSizesWithHeights.MAIN};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  color: ${colors.GRAY_DARK};
  letter-spacing: 2px;
  user-select: none;
  padding: 0 5px;
`;

export default LabelWrapperStyle;
