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
  height: 240px;
  width: 80%;
  min-width: max-content;
  justify-content: center;
  display: block;
`;

export const SectionWrapperStyle: string = css`
  ${presets.BOX};
`;

// export const SectionWrapperStyle: string = css`
//   ${presets.BOX};
//   ${fontSizes.MAIN};
//   padding: 80px 100px;
//   width: 100%;
//   ${layout.GRID_VERTICAL};
//   grid-gap: 20px;
//   color: ${colors.GRAY_DARK};
//   text-align: center;
// `;

export const SubTitleWrapperStyle: string = css`
  color: ${colors.GRAY_DARK};
  ${fontSizes.MAIN};
  margin-bottom: 22px;
  align-self: start;
`;

export const ButtonWrapperStyle: string = css`
  ${layout.LAYOUT};
  justify-content: flex-end;
`;
