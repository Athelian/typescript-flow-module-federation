// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const FieldStyle = css`
  color: ${colors.BLACK};

  &:hover {
    color: ${colors.TEAL};
  }
`;

export default FieldStyle;
