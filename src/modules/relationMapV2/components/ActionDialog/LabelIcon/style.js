// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const LabelStyle = (color: string): string => css`
  color: ${colors[color]};
`;

export default LabelStyle;
