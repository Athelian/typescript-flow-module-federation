// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const SuffixStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  padding: 0 5px 0 0;
`;

export default SuffixStyle;
