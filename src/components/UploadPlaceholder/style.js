// @flow
import { css } from 'react-emotion';
import { layout, presets, colors } from 'styles/common';

export const ProgressStyle: string = css`
  ${presets.BOX};
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  width: 195px;
  height: 185px;
  color: ${colors.TEAL};
  font-size: 24px;
`;

export default ProgressStyle;
