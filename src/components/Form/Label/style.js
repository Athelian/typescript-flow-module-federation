// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizesWithHeights, fontSizes } from 'styles/common';

type LabelType = {
  align: 'left' | 'right' | 'center',
  width: string,
  color: string,
};

export const LabelWrapperStyle = ({ align, width, color }: LabelType) => css`
  width: ${width};
  ${fontSizesWithHeights.MAIN};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  color: ${colors[color] || colors.GRAY_DARK};
  letter-spacing: 2px;
  user-select: none;
  padding: 0 5px;
  text-align: ${align};
`;

export default LabelWrapperStyle;
