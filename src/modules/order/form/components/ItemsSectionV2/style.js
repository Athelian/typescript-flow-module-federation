// @flow
import { css } from 'react-emotion';
import { presets, transitions } from 'styles/common';

export const ItemsSectionWrapperStyle: string = css`
  display: flex;
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
  ${transitions.MAIN};
`;

export default ItemsSectionWrapperStyle;
