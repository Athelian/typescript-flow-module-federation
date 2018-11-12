// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizesWithHeights, fontSizes } from 'styles/common';

export const ShowAllButtonStyle: string = css`
  width: '100%';
  ${fontSizesWithHeights.MAIN};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  color: ${colors.GRAY_DARK};
  letter-spacing: 2px;
  user-select: none;
  padding: 0 5px;
  text-align: 'right';
  cursor: pointer;
`;

export default ShowAllButtonStyle;
