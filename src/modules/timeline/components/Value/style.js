// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, transitions } from 'styles/common';

export const ValueStyle = css`
  ${borderRadiuses.BUTTON};
  color: ${colors.BLACK};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 0 5px;
  cursor: default;

  &:hover {
    ${transitions.MAIN};
    color: ${colors.TEAL};
    background-color: rgba(17, 209, 166, 0.2);
  }
`;

export default ValueStyle;
