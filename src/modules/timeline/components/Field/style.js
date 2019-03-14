// @flow
import { css } from 'react-emotion';
import { colors, transitions } from 'styles/common';

export const FieldStyle = css`
  color: ${colors.BLACK};
  cursor: default;
  &:hover {
    ${transitions.MAIN};
    color: ${colors.TEAL};
  }
`;

export default FieldStyle;
