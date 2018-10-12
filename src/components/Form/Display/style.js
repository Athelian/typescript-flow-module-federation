// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets, borderRadiuses } from 'styles/common';

export const DisplayWrapperStyle = (
  align: 'left' | 'right' | 'center',
  color: string,
  fontSize: string
): string => css`
  ${fontSizesWithHeights[fontSize]};
  font-weight: bold;
  color: ${colors[color]};
  ${presets.ELLIPSIS};
  ${borderRadiuses.MAIN};
  text-align: ${align};
  min-width: 0;
  width: 100%;
  padding: 0 5px;
`;

export default DisplayWrapperStyle;
