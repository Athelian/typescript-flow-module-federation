// @flow
import { css } from 'react-emotion';
import { presets } from 'styles/common';

export const AutoCalculateToggleStyle: string = css`
  position: absolute;
  top: 0;
  right: -40px;
  ${presets.BUTTON};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
`;

export default AutoCalculateToggleStyle;
