// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout, presets } from 'styles/common';

export const InputWrapperStyle = css`
  ${layout.VERTICAL};
  padding-bottom: 20px;
`;

export const HeaderWrapperStyle = css`
  ${layout.HORIZONTAL};
  justify-content: space-between;
  padding: 10px 0 20px;
`;

export const TitleStyle = css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  letter-spacing: 0.2em;
`;

export const ButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
  &:not([disabled]) {
    cursor: pointer;
    &:hover {
      color: ${colors.TEAL};
    }
  }
`;
