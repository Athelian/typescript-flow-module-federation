// @flow
import { css } from 'react-emotion';
import { presets } from 'styles/common';

export const SectionWrapperStyle: string = css`
  ${presets.BOX};
  display: flex;
  justify-content: center;
  width: 880px;
  padding: 40px 0;
`;

export default SectionWrapperStyle;
