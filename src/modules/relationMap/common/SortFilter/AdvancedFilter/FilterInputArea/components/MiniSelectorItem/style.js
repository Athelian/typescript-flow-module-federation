// @flow
import { css } from 'react-emotion';
import { presets, fontSizes, colors } from 'styles/common';

export const MiniSelectorItemStyle: string = css`
  grid-gap: 10px;
  width: 200px;
  height: 30px;
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  align-items: center;
  font-weight: bold;
  color: ${colors.BLACK};
  padding: 0 10px;
  line-height: 30px;
`;

export default MiniSelectorItemStyle;
