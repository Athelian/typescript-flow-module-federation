// @flow
import { css } from 'react-emotion';
import { colors, presets, layout, fontSizes } from 'styles/common';

export const IconStyle: string = css`
  ${fontSizes.ENORMOUS};
`;

export const LinkStyle: string = css`
  color: ${colors.TEAL};
  &:visited {
    color: ${colors.GRAY_DARK};
  }
`;

export const FormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const SectionWrapperStyle: string = css`
  ${presets.BOX};
  ${fontSizes.MAIN};
  width: 818px;
  padding: 40px 100px;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  color: ${colors.GRAY_DARK};
  text-align: center;
`;

export const ButtonWrapperStyle: string = css`
  ${layout.LAYOUT};
  justify-content: flex-end;
`;
