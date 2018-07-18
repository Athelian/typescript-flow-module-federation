// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, transitions } from 'styles/common';

export const ErrorStyle = css`
  background-color: ${colors.RED};
`;

export const ErrorButtonStyle = css`
  position: absolute;
  ${fontSizes.SMALL}
  color: ${colors.RED};
  right: 0;
  ${transitions.MAIN};
  &:hover {
    color: ${colors.RED_DARK};
  }
`;
