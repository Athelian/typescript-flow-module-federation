// @flow
import { css } from 'react-emotion';
import { colors, presets, layout, fontSizes } from 'styles/common';

export const ButtonWrapperStyle: string = css`
  ${layout.LAYOUT};
  justify-content: flex-end;
`;

export const FormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  justify-content: center;
  padding-top: 50px;
  height: 240px;
  width: 80%;
  min-width: max-content;
  display: block;
`;

export const IconStyle: string = css`
  ${fontSizes.ENORMOUS};
`;

export const LinkStyle: string = css`
  color: ${colors.TEAL};
  cursor: pointer;
`;

export const SectionWrapperStyle: string = css`
  ${presets.BOX};
  ${fontSizes.MAIN};
  ${layout.GRID_VERTICAL};
  padding: 80px 100px;
  width: 100%;
  grid-gap: 20px;
  color: ${colors.GRAY_DARK};
  text-align: center;
`;

export const SubTitleWrapperStyle: string = css`
  color: ${colors.GRAY_DARK};
  ${fontSizes.MAIN};
  margin-bottom: 22px;
  align-self: start;
`;
