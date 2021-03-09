// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets, borderRadiuses } from 'styles/common';

type DisplayWrapperType = {
  align: 'left' | 'right' | 'center',
  width: string,
  height: string,
  color: string,
  fontSize: string,
  lines: number,
};

const webkitLines = (numLines: number, height: string = '20px') => {
  if (!numLines) {
    return `
    height: ${height};
    `;
  }

  return `
    -webkit-line-clamp: ${numLines};
    height: ${numLines * 20}px;
  `;
};

export const DisplayWrapperStyle = ({
  align,
  width,
  height,
  color,
  fontSize,
  lines,
}: DisplayWrapperType): string => css`
  ${fontSizesWithHeights[fontSize]};
  font-weight: bold;
  height: ${height};
  color: ${colors[color]};
  ${lines ? presets.MULTI_LINE_ELLIPSIS : presets.ELLIPSIS};
  ${webkitLines(lines, height)}
  ${borderRadiuses.MAIN};
  text-align: ${align};
  min-width: 0;
  width: ${width};
  flex: 1;
  max-width: ${width};
  padding: 0 5px;
  line-height: ${height};
`;

export default DisplayWrapperStyle;
