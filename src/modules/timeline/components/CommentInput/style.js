// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const InputWrapperStyle = css`
  position: relative;
  padding-bottom: 20px;
`;

export const ButtonStyle = css`
  position: absolute;
  bottom: 25px;
  right: 5px;
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
  &:not([disabled]) {
    cursor: pointer;
    &:hover {
      color: ${colors.TEAL};
    }
  }
`;
