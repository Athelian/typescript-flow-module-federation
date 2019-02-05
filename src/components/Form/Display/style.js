// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets, borderRadiuses } from 'styles/common';

type DisplayWrapperType = {
  align: 'left' | 'right' | 'center',
  width: string,
  color: string,
  fontSize: string,
};

export const DisplayWrapperStyle = ({
  align,
  width,
  color,
  fontSize,
}: DisplayWrapperType): string => css`
  ${fontSizesWithHeights[fontSize]};
  font-weight: bold;
  color: ${colors[color]};
  ${presets.ELLIPSIS};
  ${borderRadiuses.MAIN};
  text-align: ${align};
  min-width: 0;
  width: ${width};
  flex: 1;
  padding: 0 5px;
`;

export default DisplayWrapperStyle;
