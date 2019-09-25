// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes, transitions } from 'styles/common';

type LabelWrapperType = {
  align: 'left' | 'right' | 'center',
  height: string,
  width: string,
  color: string,
};

export const LabelWrapperStyle = ({ align, height, width, color }: LabelWrapperType): string => css`
  width: ${width};
  height: ${height};
  max-height: ${height};
  line-height: ${height};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  color: ${colors[color]};
  letter-spacing: 2px;
  user-select: none;
  padding: 0 5px;
  text-align: ${align};
  flex: 1;
  max-width: ${width};
  text-transform: uppercase;
  ${transitions.MAIN};
`;

export default LabelWrapperStyle;
