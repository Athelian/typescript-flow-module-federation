// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizesWithHeights, fontSizes } from 'styles/common';

type LabelWrapperType = {
  align: 'left' | 'right' | 'center',
  width: string,
  color: string,
};

export const LabelWrapperStyle = ({ align, width, color }: LabelWrapperType): string => css`
  width: ${width};
  ${fontSizesWithHeights.MAIN};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  color: ${colors[color] || colors.GRAY_DARK};
  letter-spacing: 2px;
  user-select: none;
  padding: 0 5px;
  text-align: ${align};
  flex: 1;
  max-width: ${width};
`;

export default LabelWrapperStyle;
