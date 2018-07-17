// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, transitions } from 'styles/common';

export const WarningStyle = css`
  background-color: ${colors.YELLOW};
`;

export const WarningButtonStyle = css`
  position: absolute;
  ${fontSizes.SMALL}
  color: ${colors.YELLOW};
  right: 0;
  ${transitions.MAIN};
  &:hover {
    color: ${colors.YELLOW_DARK};
  }
`;
