// @flow
import { css } from 'react-emotion';
import { presets } from 'styles/common';

export const CargoSectionWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 235px 1fr;
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export default CargoSectionWrapperStyle;
