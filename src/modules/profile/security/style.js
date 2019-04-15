// @flow
import { css } from 'react-emotion';
import { presets, layout } from 'styles/common';

export const FormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const SectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 100px;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
`;

export const ButtonWrapperStyle: string = css`
  ${layout.LAYOUT};
  justify-content: flex-end;
`;
