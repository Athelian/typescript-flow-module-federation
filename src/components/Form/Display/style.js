// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets, borderRadiuses } from 'styles/common';

export const DisplayWrapperStyle = (
  align: 'left' | 'right' | 'center',
  color: string,
  fontSize: string
) => css`
  ${fontSizesWithHeights[fontSize]};
  font-weight: bold;
  color: ${colors[color]};
  ${presets.ELLIPSIS};
  ${borderRadiuses.MAIN};
  text-align: ${align};
  width: 100%;
  max-width: min-content;
`;

export default DisplayWrapperStyle;
