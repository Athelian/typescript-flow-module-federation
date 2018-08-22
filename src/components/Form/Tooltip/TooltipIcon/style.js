// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses } from 'styles/common';

export const IconStyle = (color: string) => css`
  color: ${color};
  cursor: pointer;
`;

export const ChangedStyle = css`
  width: 15px;
  height: 15px;
  background: ${colors.TEAL};
  ${borderRadiuses.CIRCLE};
  cursor: pointer;
`;
