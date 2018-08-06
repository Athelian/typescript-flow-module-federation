// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, transitions } from 'styles/common';

export const InfoStyle = css`
  background-color: ${colors.GRAY_DARK};
`;

export const InfoButtonStyle = css`
  position: absolute;
  ${fontSizes.SMALL}
  color: ${colors.GRAY_LIGHT};
  right: 0;
  ${transitions.MAIN};
  &:hover {
    color: ${colors.GRAY};
  }
`;
