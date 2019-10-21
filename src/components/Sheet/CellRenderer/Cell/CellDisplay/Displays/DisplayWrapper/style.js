// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout, presets } from 'styles/common';

export const DisplayWrapperStyle = (width: string): string => css`
  ${layout.LAYOUT};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  padding: 5px;
  width: ${width};
  & > span {
    ${fontSizes.MAIN};
    ${presets.ELLIPSIS};
    color: ${colors.BLACK};
    font-weight: bold;
  }
`;

export default DisplayWrapperStyle;
