// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets, borderRadiuses } from 'styles/common';

type DisplayWrapperType = {
  align: 'left' | 'right' | 'center',
  width: string,
  height: string,
  color: string,
  fontSize: string,
};

export const DisplayWrapperStyle = ({
  align,
  width,
  height,
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
  max-width: ${width};
  padding: 0 5px;
  height: ${height};
  line-height: ${height};
`;

export default DisplayWrapperStyle;
