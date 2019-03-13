// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors } from 'styles/common';

export const FieldStyle = css`
  color: ${colors.BLACK};

  &:hover {
    color: ${colors.TEAL};
  }
`;

export const ValueStyle = css`
  ${borderRadiuses.BUTTON};
  color: ${colors.BLACK};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 0 5px;

  &:hover {
    color: ${colors.TEAL};
    background-color: rgba(17, 209, 166, 0.2);
  }
`;
