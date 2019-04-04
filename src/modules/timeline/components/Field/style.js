// @flow
import { css } from 'react-emotion';
import { colors, transitions } from 'styles/common';

export const FieldStyle = css`
  ${transitions.MAIN};
  color: ${colors.BLACK};
  cursor: default;

  &:hover {
    color: ${colors.TEAL};
  }
`;

export default FieldStyle;
